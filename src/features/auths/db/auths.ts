import { signupSchema, signinSchema } from "@/features/auths/schemas/auths";
import { revalidateUserCache } from "@/features/users/db/cache";
import { getUserById } from "@/features/users/db/users";
import { db } from "@/lib/db";
import { genSalt, hash, compare } from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { cookies, headers } from "next/headers";
import { Resend } from "resend";
import EmailTemplate from "../components/EmailTemplate";
import { JWTExpired } from "jose/errors";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SigninInput {
  email: string;
  password: string;
}

interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

const generateJwtToken = async (userId: string, exp: string = "30d") => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
};

const setCookieToken = async (token: string) => {
  const cookie = await cookies();
  cookie.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30,
  });
};

export const signup = async (input: SignupInput) => {
  try {
    const { success, data, error } = signupSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      return {
        message: "อีเมลนี้มีผู้ใช้งานแล้ว",
      };
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(data.password, salt);

    const newUser = db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const token = await generateJwtToken((await newUser).id);
    await setCookieToken(token);

    revalidateUserCache((await newUser).id);
  } catch (error) {
    console.error("Error sign up user:", error);
    return {
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  }
};

export const signin = async (input: SigninInput) => {
  try {
    const { success, data, error } = signinSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const user = await db.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    if (user.status !== "Active") {
      return {
        message: "บัญชีของคุณไม่พร้อมใช้งาน",
      };
    }

    const isValidPassword = await compare(data.password, user.password);

    if (!isValidPassword) {
      return {
        message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
      };
    }

    const token = await generateJwtToken(user.id);
    await setCookieToken(token);
  } catch (error) {
    console.error("Error sign in user: ", error);
    return {
      message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
    };
  }
};

export const authCheck = async () => {
  // const head = await headers();
  // const userId = head.get("x-user-id");
  const userId = (await headers()).get("x-user-id");

  return userId ? await getUserById(userId) : null;
};

export const signout = async () => {
  try {
    (await cookies()).delete("token");
  } catch (error) {
    console.error("Error sign out user: ", error);
    return { message: "เกิดข้อผิดพลาดในการออกจากระบบ" };
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) return { message: "ไม่พบบัญชีที่ใช้อีเมลนี้" };

    const token = await generateJwtToken(user.id, "15m");

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`;

    await resend.emails.send({
      from: "Art Store <onboarding@resend.dev>",
      to: email,
      subject: "รีเซ็ตรหัสผ่านของคุณ",
      react: EmailTemplate({ fname: user.name || user.email, resetLink }),
    });
  } catch (error) {
    console.error("Error sending reset password email", error);
    return { message: "เกิดข้อผิดพลาดในการส่งคำขอรีเซ็ตรหัสผ่าน" };
  }
};

export const resetPassword = async (input: ResetPasswordInput) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload } = await jwtVerify(input.token, secret);

    if (input.password !== input.confirmPassword)
      return { message: "รหัสผ่านไม่ตรงกัน" };

    const salt = await genSalt(10);
    const hashedPassword = await hash(input.password, salt);

    const updatedUser = await db.user.update({
      where: { id: payload.id as string },
      data: {
        password: hashedPassword,
      },
    });

    revalidateUserCache(updatedUser.id);
  } catch (error) {
    console.error("Error resetting password: ", error);

    if (error instanceof JWTExpired)
      return { message: "คำขอของคุณหมดอายุแล้ว" };

    return { message: "เกิดข้อผิดพลาดในการกู้คืนรหัสผ่าน" };
  }
};
