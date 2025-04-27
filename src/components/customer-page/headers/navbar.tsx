import { UserType } from "@/types/user";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";

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
      <div className="hidden">
        <div>Desktop Link</div>
        {user ? <div>Desktop User Menu</div> : <div>Go to sign in button</div>}
      </div>
    </nav>
  );
};
export default Navbar;
