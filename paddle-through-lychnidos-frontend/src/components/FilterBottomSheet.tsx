import { Search, X } from "lucide-react";
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
    : "border-border-default bg-surface-card text-text-primary";
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

  function clearAll() {
    onChange({ searchWord: "", categoryId: null, regionId: null });
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/40 md:items-center">
      <div className="flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-3xl border border-border-default bg-surface-card p-6 md:max-w-md md:rounded-3xl">
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

        <div className="relative mb-6">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={filters.searchWord}
            onChange={(e) =>
              onChange({ ...filters, searchWord: e.target.value })
            }
            placeholder="Search shops..."
            className="w-full rounded-xl border border-border-default bg-surface-card py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none focus:border-primary-500"
          />
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

        <div className="mb-6">
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

        <div className="mt-auto flex flex-col gap-3">
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
            className="text-center text-sm font-semibold text-text-secondary"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}
