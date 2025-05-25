import AuthHeader from "@/features/auths/components/AuthHeader";
import ForgotPasswordForm from "@/features/auths/components/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <AuthHeader type="forgot-password">
      <ForgotPasswordForm />
    </AuthHeader>
  );
};
export default ForgotPasswordPage;
