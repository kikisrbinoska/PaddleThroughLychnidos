import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import type { ProductListItem } from "../types";
import { getCategoryAccent } from "../utils/categoryStyle";
import { resolveUploadUrl } from "../utils/resolveUploadUrl";

export interface ProductCardProps {
  product: ProductListItem;
  categoryName: string;
  // Only set on the marketplace grid, where products from many shops are
  // mixed together - ShopDetailPage's grid omits these since the shop is
  // already obvious from context.
  shopName?: string;
  shopIsVerified?: boolean;
}

export function ProductCard({
  product,
  categoryName,
  shopName,
  shopIsVerified,
}: ProductCardProps) {
  const accent = getCategoryAccent(categoryName);

  return (
    <Link
      to={`/product/${product.id}`}
      className="block rounded-2xl border border-white/60 bg-white/55 p-3 backdrop-blur-md"
    >
      {product.imageUrl ? (
        <img
          src={resolveUploadUrl(product.imageUrl)}
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
      {shopName && (
        <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-text-secondary">
          {shopName}
          {shopIsVerified && (
            <BadgeCheck size={11} className="flex-none text-secondary-700" />
          )}
        </p>
      )}
    </Link>
  );
}
