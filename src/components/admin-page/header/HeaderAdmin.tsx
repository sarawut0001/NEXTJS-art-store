"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/useSignout";
import { useSidebar } from "@/providers/SidebarProvider";
import { UserType } from "@/types/user";
import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderAdminProps {
  user: UserType;
}

const HeaderAdmin = ({ user }: HeaderAdminProps) => {
  const { toggleSidebar } = useSidebar();
  const { isPending, handleSignout } = useSignout();

  return (
    <header className="fixed top-0 inset-x-0 md:left-64 h-16 border-b z-10 transition-all duration-200">
      <div className="flex h-full items-center w-full justify-between px-4">
        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar>
                <AvatarImage
                  src={user.picture || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.slice(0, 2).toUpperCase() || "Us"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleSignout}
              disabled={isPending}
              className="cursor-pointer text-destructive hover:text-red-400"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
export default HeaderAdmin;
