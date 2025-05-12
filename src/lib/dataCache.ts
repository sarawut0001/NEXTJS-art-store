type CACHE_TAG = "users" | "categories" | "products" | "orders";

export const getGlobalTag = async (tag: CACHE_TAG) => {
  return `global:${tag}` as const;
};

export const getIdTag = async (tag: CACHE_TAG, id: string) => {
  return `id:${id}-${tag}` as const;
};
