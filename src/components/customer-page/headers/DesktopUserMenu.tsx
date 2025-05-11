import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserType } from "@/types/user";
import Link from "next/link";
import { SignoutButton, UserAvatarSmall, UserDropdownAvatar } from "./UserComp";

interface DesktopUserMenuProps {
  user: UserType;
  itemCount: number;
}

const DesktopUserMenu = ({ user, itemCount }: DesktopUserMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="size-8 rounded-full">
        <UserAvatarSmall user={user} />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" sideOffset={4} className="w-56">
      <DropdownMenuLabel className="flex flex-col items-center gap-2">
        <UserDropdownAvatar user={user} />
        <span>Hello, {user.name || user.email}</span>
      </DropdownMenuLabel>

      <DropdownMenuItem className="cursor-pointer" asChild>
        <Link href="/profile">โปรไฟล์ของฉัน</Link>
      </DropdownMenuItem>

      <DropdownMenuItem className="cursor-pointer" asChild>
        <Link href="/cart">
          <span>ตะกร้าสินค้า</span>
          <Badge className="ml-auto">{itemCount}</Badge>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem className="cursor-pointer" asChild>
        <Link href="/my-orders">ประวัติการสั่งซื้อ</Link>
      </DropdownMenuItem>

      {user.role === "Admin" && (
        <>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/admin">หลังบ้าน</Link>
          </DropdownMenuItem>
        </>
      )}

      <DropdownMenuSeparator />

      <div>
        <SignoutButton />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);
export default DesktopUserMenu;
