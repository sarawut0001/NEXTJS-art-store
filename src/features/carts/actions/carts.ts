"use server";

import { addToCart } from "../db/carts";

export const addToCartAction = async (formData: FormData) => {
  const data = {
    productId: formData.get("product-id") as string,
    count: parseInt(formData.get("count") as string) || 1,
  };

  const result = await addToCart(data);

  if (result && result.message) {
    return {
      success: false,
      message: result.message,
    };
  } else {
    return {
      success: true,
      message: "Add products to cart successfully!",
    };
  }
};
