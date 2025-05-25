import AuthHeader from "@/features/auths/components/AuthHeader";
import ResetPasswordForm from "@/features/auths/components/ResetPasswordForm";
import { redirect } from "next/navigation";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token: string;
  }>;
}

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { token } = await searchParams;

  if (!token) redirect("/auth/signin");

  return (
    <AuthHeader type="reset-password">
      <ResetPasswordForm token={token} />
    </AuthHeader>
  );
};
export default ResetPasswordPage;
