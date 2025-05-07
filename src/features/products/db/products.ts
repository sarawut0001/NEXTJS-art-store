import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import {
  getProductGlobalTag,
  getProductIdTag,
  revalidateProductCache,
} from "./cache";
import { productSchema } from "../schemas/products";
import { authCheck } from "@/features/auths/db/auths";
import { canCreateProduct, canUpdateProduct } from "../permissions/products";
import { redirect } from "next/navigation";
import { deleteFromImageKit } from "@/lib/imageKit";
import { ProductStatus } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description: string;
  cost?: number;
  basePrice: number;
  price: number;
  stock: number;
  categoryId: string;
  mainImageIndex: number;
  images: Array<{ url: string; fileId: string }>;
}

export const getProducts = async () => {
  "use cache";

  cacheLife("hours");
  cacheTag(await getProductGlobalTag());

  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: {
          where: { isMain: true },
          take: 1,
        },
      },
    });

    return products.map((product) => ({
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: product.images.length > 0 ? product.images[0] : null,
    }));
  } catch (error) {
    console.error("Error getting products: ", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(await getProductIdTag(id));

  try {
    const product = await db.product.findFirst({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      return null;
    }

    // Find Main Image Product
    const mainImage = product.images.find((image) => image.isMain);
    // Find index main image
    const mainImageIndex = mainImage
      ? product.images.findIndex((image) => image.isMain)
      : 0;

    return {
      ...product,
      lowStock: 5,
      sku: product.id.substring(0, 8).toUpperCase(),
      mainImage: mainImage || null,
      mainImageIndex,
    };
  } catch (error) {
    console.error("Error getting product by id", error);
    return null;
  }
};

export const createProduct = async (input: CreateProductInput) => {
  const user = await authCheck();

  if (!user || !canCreateProduct(user)) redirect("/");

  try {
    const { success, data, error } = productSchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors,
      };
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: data.categoryId, status: "Active" },
    });

    if (!category) {
      return {
        message: "Selected category not found or inactive",
      };
    }

    // Create new product
    const newProduct = await db.$transaction(async (prisma) => {
      const product = await prisma.product.create({
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
      });

      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image, index) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: input.mainImageIndex === index,
                productId: product.id,
              },
            });
          })
        );
      }

      return product;
    });

    revalidateProductCache(newProduct.id);
  } catch (error) {
    console.error("Error creating product: ", error);
    return { message: "Something went wrong. Please try again later" };
  }
};

export const updateProduct = async (
  input: CreateProductInput & {
    id: string;
    deletedImageIds: string[];
  }
) => {
  const user = await authCheck();

  if (!user || !canUpdateProduct(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = productSchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid product information",
        error: error.flatten().fieldErrors,
      };
    }

    const existingProduct = await db.product.findUnique({
      where: { id: input.id },
      include: { images: true },
    });

    if (!existingProduct) {
      return { message: "Product not found" };
    }

    const category = await db.category.findUnique({
      where: { id: data.categoryId, status: "Active" },
    });

    if (!category) {
      return { message: "Selected category not found or inactive" };
    }

    if (input.deletedImageIds && input.deletedImageIds.length > 0) {
      for (const deletedImageId of input.deletedImageIds) {
        const imageToDelte = existingProduct.images.find(
          (image) => image.id === deletedImageId
        );

        if (imageToDelte) {
          await deleteFromImageKit(imageToDelte.fileId);
        }
      }
    }

    const updatedProduct = await db.$transaction(async (prisma) => {
      // 1. update information product
      const product = await prisma.product.update({
        where: { id: input.id },
        data: {
          title: data.title,
          description: data.description,
          cost: data.cost,
          basePrice: data.basePrice,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
        },
      });

      // 2. delete select image from dagabase
      if (input.deletedImageIds && input.deletedImageIds.length > 0) {
        await prisma.productImage.deleteMany({
          where: {
            id: { in: input.deletedImageIds },
            productId: product.id,
          },
        });
      }

      // 3. set isMain = false all
      await prisma.productImage.updateMany({
        where: {
          productId: product.id,
        },
        data: { isMain: false },
      });

      // 4. add new image
      if (input.images && input.images.length > 0) {
        await Promise.all(
          input.images.map((image) => {
            return prisma.productImage.create({
              data: {
                url: image.url,
                fileId: image.fileId,
                isMain: false,
                productId: product.id,
              },
            });
          })
        );
      }

      // 5. find all image and set main image
      const allImages = await prisma.productImage.findMany({
        where: { productId: product.id },
        orderBy: { createdAt: "asc" },
      });

      if (allImages.length > 0) {
        const validIndex = Math.min(input.mainImageIndex, allImages.length - 1);
        if (validIndex >= 0) {
          await prisma.productImage.update({
            where: {
              id: allImages[validIndex].id,
            },
            data: { isMain: true },
          });
        }
      }

      return product;
    });

    revalidateProductCache(updatedProduct.id);
  } catch (error) {
    console.error("Error updating product: ", error);
    return { message: "Something went wrong. Please try agian later." };
  }
};

export const changeProductStatus = async (
  id: string,
  status: ProductStatus
) => {
  const user = await authCheck();

  if (!user || !canUpdateProduct(user)) redirect("/");

  try {
    const product = await db.product.findUnique({
      where: { id },
    });

    if (!product) {
      return { message: "Product not found" };
    }

    if (product.status === status) {
      return { message: `Product is already ${status.toLowerCase()}` };
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: { status },
    });

    revalidateProductCache(updatedProduct.id);
  } catch (error) {
    console.error("Error changing product status: ", error);
    return { message: "Something went wrong. Please try again later." };
  }
};
