import CartItems from "@/features/carts/components/CartItems";
import CartSummary from "@/features/carts/components/CartSummary";
import EmptyCart from "@/features/carts/components/EmptyCart";
import { getUserCart } from "@/features/carts/db/carts";
import { headers } from "next/headers";

const CartPage = async () => {
  const head = headers();
  const userId = (await head).get("x-user-id");

  const cart = await getUserCart(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartItems cart={cart} />
          </div>

          <div className="lg:col-span-1">
            <CartSummary cart={cart} />
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;
