import { z } from "zod";

// Define Constants
const MIN_TITLE_LENGTH = 3;
const MIN_DES_lENGTH = 3;

// Define Error Message
const ERROR_MESSAGE = {
  title: `Product title must be at least ${MIN_TITLE_LENGTH} characters`,
  description: `Description must be at least ${MIN_DES_lENGTH} characters`,
  categoryId: "Category is required",
  basePrice: "Base price must be a positive number",
  price: "Sale price must be a positive number",
  stock: "Stock must be a positive number",
};

// Create product shcema
export const productSchema = z.object({
  title: z.string().min(MIN_TITLE_LENGTH, { message: ERROR_MESSAGE.title }),

  description: z
    .string()
    .min(MIN_DES_lENGTH, { message: ERROR_MESSAGE.description }),

  categoryId: z.string().min(1, { message: ERROR_MESSAGE.categoryId }),

  cost: z.coerce.number().nonnegative().optional(),

  basePrice: z.coerce.number().positive({ message: ERROR_MESSAGE.basePrice }),

  price: z.coerce.number().positive({ message: ERROR_MESSAGE.price }),

  stock: z.coerce.number().positive({ message: ERROR_MESSAGE.stock }),
});
