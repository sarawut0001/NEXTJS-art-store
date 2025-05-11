import { UserType } from "@/types/user";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import { DesktopNavLinks } from "./Navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./DesktopUserMenu";
import { getCartItemCount } from "@/features/carts/db/carts";

interface NavbarProps {
  user: UserType | null;
}

const Navbar = async ({ user }: NavbarProps) => {
  const itemCount = user ? await getCartItemCount(user.id) : 0;

  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />

        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount} />
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
