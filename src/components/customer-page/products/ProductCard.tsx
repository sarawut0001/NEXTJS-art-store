import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import AddToCartButton from "@/features/carts/components/AddToCartButton";

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discount =
    product.basePrice > product.price
      ? ((product.basePrice - product.price) / product.basePrice) * 100
      : 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md">
      <Link href={`/products/${product.id}`}>
        <div className="relative pt-[100%] overflow-hidden bg-muted-foreground">
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 z-10 px-2 py-1">
              -{Math.round(discount)} %
            </Badge>
          )}

          <div className="absolute inset-0 size-full transition-transform duration-500 group-hover:scale-105">
            <Image
              alt={product.title}
              src={product.mainImage?.url || "/images/no-product-image.webp"}
              fill
              className="object-cover"
            />
          </div>

          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <Badge variant="destructive" className="text-sm px-3 py-1">
                out of stock
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium line-clamp-2 min-h-[18px] group-hover:text-primary transition-colors duration-200">
              {product.title}
            </h3>
          </Link>

          <div className="flex justify-between items-baseline">
            <div className="flex flex-col">
              <span className="font-medium text-lg">
                {formatPrice(product.price)}
              </span>
              {product.basePrice > product.price && (
                <span className="text-sm line-through text-muted-foreground">
                  {product.basePrice}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <Badge
                variant="outline"
                className={cn(
                  "transition-colors",
                  product.stock <= product.lowStock
                    ? "text-amber-500 border-amber-500"
                    : "text-green-600 border-green-600"
                )}
              >
                {product.stock <= product.lowStock
                  ? "Little left"
                  : "Ready to send"}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-destructive border-destructive"
              >
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 gap-2">
        <AddToCartButton
          productId={product.id}
          stock={product.stock}
          className="w-full gap-1"
        />
      </CardFooter>
    </Card>
  );
};
export default ProductCard;
