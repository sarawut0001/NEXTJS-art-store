import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";

export const AuthButton = () => {
  return (
    <div className="flex justify-center gap-3">
      <Button size="lg" asChild>
        <SheetClose asChild>
          <Link href="/auth/signup">สมัครสมาชิก</Link>
        </SheetClose>
      </Button>
      <Button variant="outline" size="lg" asChild>
        <SheetClose asChild>
          <Link href="/auth/signin">เข้าสู่ระบบ</Link>
        </SheetClose>
      </Button>
    </div>
  );
};
