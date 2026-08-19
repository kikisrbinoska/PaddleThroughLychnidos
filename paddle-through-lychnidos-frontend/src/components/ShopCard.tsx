import { Link } from "react-router-dom";
import { BadgeCheck, Star } from "lucide-react";
import type { ShopListItem } from "../types";
import { Badge } from "./Badge";
import { CategoryImage } from "./CategoryImage";

export interface ShopCardProps {
  shop: ShopListItem;
  // Overrides the default fixed-width sizing (w-40, meant for horizontal
  // scroll rows) - pass "w-full" when placing this card in a grid instead.
  className?: string;
}

export function ShopCard({
  shop,
  className = "w-40 flex-none snap-start md:w-full",
}: ShopCardProps) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      className={`overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm ${className}`}
    >
      <div className="relative h-28 w-full">
        <CategoryImage shop={shop} className="h-full w-full" />
        {shop.isVerified && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
            <BadgeCheck size={16} className="text-secondary-700" />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-bold text-text-primary">
          {shop.name}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="primary">{shop.categoryName}</Badge>
          {shop.regionId !== null && (
            <span className="text-xs text-text-secondary">
              {shop.regionName}
            </span>
          )}
        </div>
        {shop.rating !== null && (
          <div className="flex items-center gap-1 text-xs text-text-secondary">
            <Star size={12} className="fill-nosija-gold-700 text-nosija-gold-700" />
            <span className="font-semibold text-text-primary">
              {shop.rating.toFixed(1)}
            </span>
            {shop.userRatingCount !== null && (
              <span>({shop.userRatingCount})</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
