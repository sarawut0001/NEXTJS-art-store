import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import Link from "next/link";

const NAV_LINKS = [
  { title: "หน้าแรก", href: "/" },
  { title: "สินค้าทั้งหมด", href: "/products" },
  { title: "เกี่ยวกับ", href: "/about" },
  { title: "ติดต่อเรา", href: "/contact" },
];

export const MobileNavLinks = () => (
  <div className="flex flex-col gap-2">
    {NAV_LINKS.map((link, index) => (
      <SheetClose key={index} asChild>
        <Button variant="secondary" size="lg">
          {link.title}
          <Link href={link.href}></Link>
        </Button>
      </SheetClose>
    ))}
  </div>
);
