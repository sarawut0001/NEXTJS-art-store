import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  //   SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { UserType } from "@/types/user";
import { AuthButton } from "@/components/customer-page/headers/UserComp";

interface MobileMenuProps {
  user: UserType | null;
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu size={20} />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col w-full md:max-w-sm">
        <SheetHeader>
          <SheetTitle className="text-primary text-xl">
            {user ? "Your Profile" : "Welcome"}
          </SheetTitle>
        </SheetHeader>

        <div>
          {/* User Profile && Auth Button */}

          {user ? <div>User Profile</div> : <AuthButton />}

          {/* Nav Link */}

          {/* Go to admin page button */}
          {user && user.role === "Admin" && <div>Go to main page</div>}

          {user && (
            <SheetFooter>
              <div>Sign out button</div>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default MobileMenu;
