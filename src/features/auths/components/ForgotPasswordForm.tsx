"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import { forgotPasswordAction } from "../action/auths";
import { useForm } from "@/hooks/useForm";

const ForgotPasswordForm = () => {
  const { formAction, isPending } = useForm(
    forgotPasswordAction,
    "/auth/signin"
  );

  return (
    <Form action={formAction}>
      <CardContent>
        <InputForm label="อีเมล" id="email" type="email" required />
      </CardContent>

      <CardFooter className="pt-6">
        <SubmitBtn
          name="ส่งลิงค์เพื่อรีเซ็ตรหัสผ่าน"
          className="w-full"
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};
export default ForgotPasswordForm;
