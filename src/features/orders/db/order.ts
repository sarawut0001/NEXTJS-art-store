import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import { canCancelOrder, canCreateOrder } from "../permissions/order";
import { checkoutSchema } from "../schemas/order";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { clearCart } from "@/features/carts/db/carts";
import { getOrderIdTag, revalidateOrderCache } from "./cache";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import formatDate from "@/lib/formatDate";
import { uploadToImageKit } from "@/lib/imageKit";

interface CheckoutInput {
  address: string;
  phone: string;
  note?: string;
  useProfileData?: string;
}

export const createOrder = async (input: CheckoutInput) => {
  const user = await authCheck();

  if (!user || !canCreateOrder(user)) redirect("/auth/signin");

  try {
    const useProfileData = input.useProfileData === "on";

    if (useProfileData && user.address && user.tel) {
      input.address = user.address;
      input.phone = user.tel;
    }

    const { success, data, error } = checkoutSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const cart = await db.cart.findFirst({
      where: { orderedById: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.products.length === 0)
      return { message: "Cart is empty" };

    const shippingFee = 50;

    const orderNumber = generateOrderNumber();

    const totalAmount = cart.cartTotal + shippingFee;

    // create new order
    const newOrder = await db.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          totalAmount,
          status: "Pending",
          address: data.address,
          phone: data.phone,
          note: data.note,
          shippingFee,
          customerId: user.id,
        },
      });

      for (const item of cart.products) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            images: true,
          },
        });

        if (!product || product.stock < item.count) {
          throw new Error(`สินค้า ${product?.title} มีไม่เพียงพอ`);
        }

        const mainImage = product.images.find((image) => image.isMain);

        await prisma.orderItem.create({
          data: {
            quantity: item.count,
            price: product.price,
            totalPrice: item.price,
            productTitle: product.title,
            productImage: mainImage?.url || null,
            orderId: order.id,
            productId: item.productId,
          },
        });

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            sold: product.sold + item.count,
            stock: product.stock - item.count,
          },
        });
      }

      return order;
    });

    if (!newOrder) return { message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ" };

    await clearCart();

    revalidateOrderCache(newOrder.id, newOrder.customerId);

    return { orderId: newOrder.id };
  } catch (error) {
    console.error("Error creating order: ", error);

    if (error instanceof Error) {
      return { message: error.message };
    }

    return { message: "Create order went wrong. Please try again later." };
  }
};

export const getOrderById = async (userId: string, orderId: string) => {
  "use cache";

  if (!userId) redirect("/auth/signin");

  cacheLife("minutes");
  cacheTag(await getOrderIdTag(orderId));

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) return null;

    const items = order.items.map((item) => {
      const mainImage = item.product.images.find((image) => image.isMain);

      return {
        ...item,
        product: {
          ...item.product,
          mainImage,
          lowStock: 5,
          sku: item.product.id.substring(0, 8).toUpperCase(),
        },
      };
    });

    return {
      ...order,
      items,
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
    };
  } catch (error) {
    console.error(`Error getting order: ${orderId}`, error);
    return null;
  }
};

export const uploadPaymentSlip = async (orderId: string, file: File) => {
  const user = await authCheck();

  if (!user) redirect("/auth/signin");

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) return { message: "Order is not found" };

    if (order.customerId !== user.id) return { message: "Is not your order!" };

    if (order.status !== "Pending")
      return {
        message: "Unable to upload proof of payment. This order has been paid.",
      };

    const uploadResult = await uploadToImageKit(file, "payment");

    if (!uploadResult || uploadResult.message) {
      return {
        message: uploadResult.message || "Can not upload image",
      };
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentImage: uploadResult.url,
        status: "Paid",
        paymentAt: new Date(),
      },
    });

    revalidateOrderCache(updatedOrder.id, updatedOrder.customerId);
  } catch (error) {
    console.error("Error uploading payment slip: ", error);
    return {
      message: "Upload payment slip went wrong, Please try again later.",
    };
  }
};

export const cancelOrderStatus = async (orderId: string) => {
  const user = await authCheck();

  if (!user || !canCancelOrder(user)) redirect("/auth/signin");

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return { message: "Order is not found" };

    if (order.customerId !== user.id) return { message: "Is not your order!" };

    if (order.status !== "Pending")
      return {
        message:
          "Can not cancel order. This order has been paid. Please contact us for further inquiries.",
      };

    await db.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Cancelled",
        },
      });
    });

    revalidateOrderCache(orderId, user.id);
  } catch (error) {
    console.error("Error canceling order: ", error);
    return { message: "Cancel order went wrong, Please try again later." };
  }
};
