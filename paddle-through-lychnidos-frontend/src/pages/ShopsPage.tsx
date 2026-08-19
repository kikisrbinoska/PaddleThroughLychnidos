import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { shopService } from "../services/shopService";
import { regionService } from "../services/regionService";
import { categoryService } from "../services/categoryService";
import type { Category, Region, ShopListItem } from "../types";
import { ShopCard } from "../components/ShopCard";
import { FilterBottomSheet, type ShopFilters } from "../components/FilterBottomSheet";
import { getErrorMessage } from "../services/errorMessage";

const PAGE_SIZE = 20;

const EMPTY_FILTERS: ShopFilters = {
  searchWord: "",
  categoryId: null,
  regionId: null,
};

export function ShopsPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [shops, setShops] = useState<ShopListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ShopFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  useEffect(() => {
    regionService.getAll().then(setRegions);
    categoryService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    shopService
      .getAll({
        searchWord: appliedFilters.searchWord || undefined,
        categoryId: appliedFilters.categoryId ?? undefined,
        regionId: appliedFilters.regionId ?? undefined,
        pageNumber,
        pageSize: PAGE_SIZE,
      })
      .then((response) => {
        if (cancelled) return;
        setShops(response.items);
        setTotalCount(response.metadata.totalCount);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load shops."));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [appliedFilters, pageNumber]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const activeFilterCount = [
    appliedFilters.searchWord,
    appliedFilters.categoryId,
    appliedFilters.regionId,
  ].filter((value) => value !== null && value !== "").length;

  function openFilters() {
    setDraftFilters(appliedFilters);
    setIsFilterOpen(true);
  }

  function applyFilters() {
    setAppliedFilters(draftFilters);
    setPageNumber(1);
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center justify-between px-6 pt-8">
        <h1 className="text-lg font-extrabold text-primary-900">Shops</h1>
        <button
          type="button"
          onClick={openFilters}
          aria-label="Open filters"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <SlidersHorizontal size={18} />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nosija-red-700 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </header>

      <div className="mt-6 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : shops.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No shops match your filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} className="w-full" />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={() => setPageNumber((p) => p - 1)}
                  className="rounded-full border border-border-default bg-surface-card px-4 py-2 text-xs font-semibold text-primary-900 disabled:opacity-40"
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
                  className="rounded-full border border-border-default bg-surface-card px-4 py-2 text-xs font-semibold text-primary-900 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        regions={regions}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
      />
    </div>
  );
}
