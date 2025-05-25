"use server";

import { InitialFormState } from "@/types/action";
import {
  signin,
  signup,
  signout,
  sendResetPasswordEmail,
} from "@/features/auths/db/auths";

export const authAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const result = rawData.confirmPassword
    ? await signup(rawData)
    : await signin(rawData);

  return result && result.message
    ? { success: false, message: result.message, errors: result.error }
    : {
        success: true,
        message: rawData.confirmPassword
          ? "สมัครสมาชิกสำเร็จ"
          : "เข้าสู่ระบบสำเร็จ",
      };
};

export const signoutAction = async () => {
  const result = await signout();
  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "ออกจากระบบสำเร็จ" };
};

export const forgotPasswordAction = async (
  _prevState: InitialFormState,
  formData: FormData
) => {
  const email = formData.get("email") as string;

  const result = await sendResetPasswordEmail(email);

  return result && result.message
    ? { success: false, message: result.message }
    : { success: true, message: "เราส่งอีเมลเพื่อขอกู้รหัสผ่านเรียบร้อยแล้ว" };
};
