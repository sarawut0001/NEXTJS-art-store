import { signupSchema } from "@/features/auths/schemas/auths";
import { db } from "@/lib/db";
import { genSalt, hash } from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const generateJwtToken = async (userId: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
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
  } catch (error) {
    console.error("Error sign up user:", error);
    return {
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก",
    };
  }
};
