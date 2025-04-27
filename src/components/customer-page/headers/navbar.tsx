import { UserType } from "@/types/user";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import { DesktopNavLinks } from "./Navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./DesktopUserMenu";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = ({ user }: NavbarProps) => {
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <CartIcon />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />

        {user ? (
          <DesktopUserMenu user={user} />
        ) : (
          <div>
            <Button size="sm" asChild>
              <Link href="/auth/signin">เข้าสู่ระบบ</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
