import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getCategoryGlobalTag = () => {
  return getGlobalTag("categories");
};

export const getCateoryIdTag = (id: string) => {
  return getIdTag("categories", id);
};

export const revalidateCategoryCache = async (id: string) => {
  revalidateTag(await getCategoryGlobalTag());
  revalidateTag(await getCateoryIdTag(id));
};
