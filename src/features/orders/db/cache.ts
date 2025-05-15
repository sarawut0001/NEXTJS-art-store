import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrderGlobalTag = () => {
  return getGlobalTag("orders");
};

export const getOrderIdTag = (orderId: string) => {
  return getIdTag("orders", orderId);
};

export const getUserOrderTag = (userId: string) => {
  return `user:${userId}:orders` as const;
};

export const revalidateOrderCache = async (orderId: string, userId: string) => {
  revalidateTag(await getOrderGlobalTag());
  revalidateTag(await getOrderIdTag(orderId));
  revalidateTag(getUserOrderTag(userId));
};
