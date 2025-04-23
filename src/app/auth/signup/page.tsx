import AuthForm from "@/features/auths/components/AuthForm";
import AuthHeader from "@/features/auths/components/AuthHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "สมัครสมาชิก",
};

const SignupPage = () => {
  const type = "signup";

  return (
    <div>
      <AuthHeader type={type}>
        <AuthForm type={type} />
      </AuthHeader>
    </div>
  );
};
export default SignupPage;
