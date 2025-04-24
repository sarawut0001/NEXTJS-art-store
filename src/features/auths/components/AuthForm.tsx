"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import AuthFooter from "./AuthFooter";
import { useForm } from "@/hooks/useForm";
import { authAction } from "../action/auths";
import ErrorMessage from "@/components/shared/ErrorMessage";

interface AuthFormProps {
  type: "signup" | "signin";
}

const AuthForm = ({ type }: AuthFormProps) => {
  const { errors, formAction, isPending, clearErrors } = useForm(
    authAction,
    "/"
  );

  const renderInput = (
    label: string,
    id: string,
    type = "text",
    requred = false
  ) => (
    <div>
      <InputForm label={label} id={id} type={type} required={requred} />
      {errors[id] && <ErrorMessage error={errors[id][0]} />}
    </div>
  );

  return (
    <Form action={formAction} onChange={clearErrors}>
      <CardContent className="flex flex-col gap-3">
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
          pending={isPending}
          className="w-full"
        />
      </CardFooter>
    </Form>
  );
};
export default AuthForm;
