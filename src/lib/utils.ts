import { OrderStatus } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "Pending":
      return "รอชำระเงิน";
    case "Paid":
      return "ชำระเงินแล้ว";
    case "Shipped":
      return "จัดส่งแล้ว";
    case "Delivered":
      return "ได้รับสินค้าแล้ว";
    case "Cancelled":
      return "ยกเลิกแล้ว";
    default:
      return status;
  }
};
