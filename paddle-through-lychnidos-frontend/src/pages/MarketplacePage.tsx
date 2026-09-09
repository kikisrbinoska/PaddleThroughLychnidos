import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { getErrorMessage } from "../services/errorMessage";
import type { Category, MarketplaceProduct } from "../types";
import { ProductCard } from "../components/ProductCard";

const PAGE_SIZE = 20;

function chipClasses(isSelected: boolean): string {
  return isSelected
    ? "border-primary-900 bg-primary-100 text-primary-900"
    : "border-white/60 bg-white/55 text-text-primary backdrop-blur-md";
}

function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/60 bg-white/55 p-3">
      <div className="h-24 w-full rounded-xl bg-primary-100" />
      <div className="mt-2 h-3 w-3/4 rounded bg-primary-100" />
      <div className="mt-1.5 h-3 w-1/2 rounded bg-primary-100" />
    </div>
  );
}

export function MarketplacePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>();
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>();

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    productService
      .getMarketplace({
        categoryId: categoryId ?? undefined,
        minPrice: appliedMinPrice,
        maxPrice: appliedMaxPrice,
        pageNumber,
        pageSize: PAGE_SIZE,
      })
      .then((response) => {
        if (cancelled) return;
        setProducts(response.items);
        setTotalCount(response.metadata.totalCount);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load products."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, appliedMinPrice, appliedMaxPrice, pageNumber]);

  function toggleCategory(id: number) {
    setCategoryId((current) => (current === id ? null : id));
    setPageNumber(1);
  }

  function applyPriceRange() {
    setAppliedMinPrice(minPrice.trim() ? Number(minPrice) : undefined);
    setAppliedMaxPrice(maxPrice.trim() ? Number(maxPrice) : undefined);
    setPageNumber(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="min-h-svh pb-24">
      <header className="px-6 pt-8">
        <h1 className="text-lg font-extrabold text-primary-900">Marketplace</h1>
        <p className="text-xs text-text-secondary">
          Handmade treasures from local artisans
        </p>
      </header>

      <div className="mt-4 px-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${chipClasses(categoryId === category.id)}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="min-price" className="text-xs font-medium text-text-secondary">
              Min price
            </label>
            <input
              id="min-price"
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-24 rounded-lg border border-border-default bg-surface-card/80 px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary-700"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="max-price" className="text-xs font-medium text-text-secondary">
              Max price
            </label>
            <input
              id="max-price"
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Any"
              className="w-24 rounded-lg border border-border-default bg-surface-card/80 px-3 py-1.5 text-xs text-text-primary outline-none focus:border-primary-700"
            />
          </div>
          <button
            type="button"
            onClick={applyPriceRange}
            className="rounded-lg bg-gradient-to-r from-primary-900 to-secondary-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-primary-900/20"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="mt-6 px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary-300/60 bg-white/40 p-8 text-center backdrop-blur-md">
            <ShoppingBag size={28} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              No products match your filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName=""
                  shopName={product.shopName}
                  shopIsVerified={product.shopIsVerified}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => p - 1)}
                  className="rounded-xl border border-white/60 bg-white/55 px-4 py-2 text-xs font-semibold text-primary-900 backdrop-blur-md disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs text-text-secondary">
                  Page {pageNumber} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageNumber >= totalPages}
                  onClick={() => setPageNumber((p) => p + 1)}
                  className="rounded-xl border border-white/60 bg-white/55 px-4 py-2 text-xs font-semibold text-primary-900 backdrop-blur-md disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
