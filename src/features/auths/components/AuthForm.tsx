"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import AuthFooter from "./AuthFooter";

interface AuthFormProps {
  type: "signup" | "signin";
}

const renderInput = (
  label: string,
  id: string,
  type = "text",
  requred = false
) => (
  <div>
    <InputForm label={label} id={id} type={type} required={requred} />
  </div>
);

const AuthForm = ({ type }: AuthFormProps) => {
  return (
    <Form action="">
      <CardContent>
        {type === "signup" && renderInput("ชื่อผู้ใช้", "name")}
        {renderInput("อีเมล", "email", "email", true)}
        {renderInput("รหัสผ่าน", "password", "password", true)}
        {type === "signup" &&
          renderInput("ยืนยันรหัสผ่าน", "confirmPassword", "password", true)}
      </CardContent>

      <CardFooter className="flex flex-col">
        <AuthFooter type={type} />

        <SubmitBtn
          name={type === "signup" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          className="w-full"
        />
      </CardFooter>
    </Form>
  );
};
export default AuthForm;
