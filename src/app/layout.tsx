import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Art Store | E-Commerce Workshop",
    template: "%s | E-Commerce Workshop",
  },
  description: "ร้านค้าออนไลน์ สำหรับสินค้าไอทีครบวงจร",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};
export default RootLayout;
