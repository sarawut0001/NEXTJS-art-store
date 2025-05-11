"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/formatPrice";
import { CartType } from "@/types/cart";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { updateCartItemAction } from "../actions/carts";
import { toast } from "sonner";

interface CartItemsProps {
  cart: CartType | null;
}

const CartItems = ({ cart }: CartItemsProps) => {
  const [isPending, startTransition] = useTransition();

  if (!cart) return null;

  const handleUpdateQty = (itemId: string, newCount: number) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("cart-item-id", itemId);
      formData.append("new-count", newCount.toString());

      const result = await updateCartItemAction(formData);

      if (result && result.message) {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Items in cart</h2>

      {cart.items.map((item, index) => (
        <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4">
          <div className="relative size-24 border border-primary rounded-md overflow-hidden">
            <Link href={`/products/${item.product.id}`}>
              <Image
                alt={item.product.title}
                src={
                  item.product.mainImage?.url || "/images/no-product-image.webp"
                }
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* Product Detail */}
          <div className="flex-1 space-y-1">
            <div className="flex justify-between">
              <Link
                href={`/products/${item.product.id}`}
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                {item.product.title}
              </Link>

              <p className="font-semibold">{formatPrice(item.price)}</p>
            </div>

            <div className="text-sm text-muted-foreground">
              Category: {item.product.category.name}
            </div>
            <div className="text-sm text-muted-foreground">
              Price/Unit: {formatPrice(item.product.price)}
            </div>

            <div>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  className="size-8"
                  disabled={item.count <= 1}
                  onClick={() => {
                    handleUpdateQty(item.id, item.count - 1);
                  }}
                >
                  <Minus size={14} />
                </Button>

                <span className="w-10 text-center">{item.count}</span>

                <Button
                  variant="outline"
                  className="size-8"
                  disabled={item.count >= item.product.stock}
                  onClick={() => {
                    handleUpdateQty(item.id, item.count + 1);
                  }}
                >
                  <Plus size={14} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};
export default CartItems;
