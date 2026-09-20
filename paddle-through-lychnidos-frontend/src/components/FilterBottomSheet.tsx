import { X } from "lucide-react";
import type { Category, Region } from "../types";
import { Button } from "./Button";

export interface ShopFilters {
  searchWord: string;
  categoryId: number | null;
  regionId: number | null;
}

export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  regions: Region[];
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  onApply: () => void;
}

function chipClasses(isSelected: boolean): string {
  return isSelected
    ? "border-primary-900 bg-primary-100 text-primary-900"
    : "border-border-default bg-white/70 text-text-primary";
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  categories,
  regions,
  filters,
  onChange,
  onApply,
}: FilterBottomSheetProps) {
  if (!isOpen) return null;

  function toggleCategory(id: number) {
    onChange({
      ...filters,
      categoryId: filters.categoryId === id ? null : id,
    });
  }

  function toggleRegion(id: number) {
    onChange({
      ...filters,
      regionId: filters.regionId === id ? null : id,
    });
  }

  const hasActiveFilters =
    filters.categoryId !== null ||
    filters.regionId !== null ||
    filters.searchWord !== "";

  function clearAll() {
    onChange({ searchWord: "", categoryId: null, regionId: null });
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 md:items-center">
      <div className="flex max-h-[85vh] w-full flex-col rounded-t-3xl border border-white/70 bg-white/80 backdrop-blur-lg md:max-w-md md:rounded-3xl">
        <div className="flex-1 overflow-y-auto p-6 pb-2">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border-default md:hidden" />

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-primary-900">Filters</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold text-text-primary">
              Craft / Category
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${chipClasses(filters.categoryId === category.id)}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-2">
            <h3 className="mb-2 text-sm font-bold text-text-primary">Region</h3>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => toggleRegion(region.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${chipClasses(filters.regionId === region.id)}`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex shrink-0 flex-col gap-3 border-t border-white/60 bg-white/90 p-6 pt-4"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <Button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="w-full"
          >
            Apply Filters
          </Button>
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasActiveFilters}
            className="text-center text-sm font-semibold text-primary-800 underline underline-offset-2 disabled:text-text-secondary disabled:no-underline disabled:opacity-50"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
}
