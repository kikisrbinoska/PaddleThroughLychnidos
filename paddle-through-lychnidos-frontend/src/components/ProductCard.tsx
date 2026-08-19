import type { ProductListItem } from "../types";
import { getCategoryAccent } from "../utils/categoryStyle";

export interface ProductCardProps {
  product: ProductListItem;
  categoryName: string;
}

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const accent = getCategoryAccent(categoryName);

  return (
    <div className="rounded-2xl border border-white/60 bg-white/55 p-2.5 backdrop-blur-md">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-24 w-full rounded-xl object-cover"
        />
      ) : (
        <div
          className={`h-24 w-full rounded-xl bg-gradient-to-br ${accent.gradientFrom} ${accent.gradientTo}`}
        />
      )}
      <p className="mt-2 truncate text-xs font-medium text-text-primary">
        {product.name}
      </p>
      <p className="text-xs font-medium text-primary-800">
        {product.price.toFixed(2)} MKD
      </p>
    </div>
  );
}
