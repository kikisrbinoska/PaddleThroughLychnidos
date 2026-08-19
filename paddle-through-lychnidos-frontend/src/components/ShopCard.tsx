import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import type { ShopListItem } from "../types";
import { Badge } from "./Badge";

export interface ShopCardProps {
  shop: ShopListItem;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="w-40 flex-none snap-start overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm md:w-full"
    >
      <div className="relative h-28 w-full bg-primary-100">
        {shop.imageUrl ? (
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-primary-900">
            No image
          </div>
        )}
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
          <span className="text-xs text-text-secondary">
            {shop.regionName}
          </span>
        </div>
      </div>
    </Link>
  );
}
