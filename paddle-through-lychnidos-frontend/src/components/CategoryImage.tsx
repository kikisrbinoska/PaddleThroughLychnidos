import { useState } from "react";
import { getCategoryAccent, getShopImage } from "../utils/categoryStyle";

export interface CategoryImageProps {
  shop: { imageUrl?: string | null; categoryName: string; name: string };
  className?: string;
}

// Renders the shop's real image, or its category's fallback image, or (if
// that file hasn't been added yet / fails to load) a themed gradient - so
// missing category assets never break the page, just look plain until the
// real files are added.
export function CategoryImage({ shop, className = "" }: CategoryImageProps) {
  const src = getShopImage(shop);
  const [failed, setFailed] = useState(false);
  const accent = getCategoryAccent(shop.categoryName);

  if (!src || failed) {
    return (
      <div
        className={`bg-gradient-to-br ${accent.gradientFrom} ${accent.gradientTo} ${className}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={shop.name}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
