import { db } from "@/lib/db";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";
import { getCategoryGlobalTag } from "./cache";

export const getCategories = async () => {
  "use cache";

  cacheLife("days");
  cacheTag(await getCategoryGlobalTag());

  try {
    return await db.category.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("Error gettingg categories data: ", error);
    return [];
  }
};
