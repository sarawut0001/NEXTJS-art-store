"use client";

import InputForm from "@/components/shared/InputForm";
import SubmitBtn from "@/components/shared/SubmitBtn";
import { CardContent, CardFooter } from "@/components/ui/card";
import Form from "next/form";
import { resetPasswordAction } from "../action/auths";
import { useForm } from "@/hooks/useForm";

interface ResetPasswordProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordProps) => {
  const { formAction, isPending } = useForm(
    resetPasswordAction,
    "/auth/signin"
  );

  return (
    <Form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <CardContent className="flex flex-col gap-4">
        <div>
          <InputForm
            label="รหัสผ่านใหม่"
            id="password"
            type="password"
            required
          />
        </div>

        <div>
          <InputForm
            label="ยืนยันรหัสผ่าน"
            id="confirm-password"
            type="password"
            required
          />
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <SubmitBtn
          name="เปลี่ยนรหัสผ่าน"
          className="w-full"
          pending={isPending}
        />
      </CardFooter>
    </Form>
  );
};
export default ResetPasswordForm;
