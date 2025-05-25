import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface AuthHeaderProps {
  type: "signup" | "signin" | "forgot-password" | "reset-password";
  children: React.ReactNode;
}

const AuthHeader = ({ type, children }: AuthHeaderProps) => {
  let title = "";
  let description = "";

  switch (type) {
    case "signup":
      title = "สมัครสมาชิก";
      description = "กรุณากรอกข้อมูลเพื่อสมัครสมาชิก";
      break;
    case "signin":
      title = "เข้าสู่ระบบ";
      description = "กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ";
      break;
    case "forgot-password":
      title = "ลืมรหัสผ่าน";
      description = "กรุณากรอกข้อมูลเพื่อรีเซ็ตรหัสผ่าน";
      break;
    case "reset-password":
      title = "รีเซ็ตรหัสผ่าน";
      description = "กรุณากรอกรหัสผ่านใหม่";
      break;
  }

  return (
    <div className="px-4 md:px-0">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
};
export default AuthHeader;
