import { X } from "lucide-react";
import type { Region } from "../types";
import { Button } from "./Button";

export interface ItineraryFilters {
  regionId: number | null;
  // Buckets rather than a raw number input, matching the "Duration" chip
  // selector called for in the Itineraries screen spec. Maps to
  // GetPagedRequest's MinDurationHours/MaxDurationHours on submit.
  durationBucket: "short" | "half-day" | "full-day" | null;
}

export interface ItineraryFilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  filters: ItineraryFilters;
  onChange: (filters: ItineraryFilters) => void;
  onApply: () => void;
}

const DURATION_OPTIONS: { value: ItineraryFilters["durationBucket"]; label: string }[] = [
  { value: "short", label: "Under 2h" },
  { value: "half-day", label: "2-4h" },
  { value: "full-day", label: "4h+" },
];

function chipClasses(isSelected: boolean): string {
  return isSelected
    ? "border-primary-900 bg-primary-100 text-primary-900"
    : "border-border-default bg-surface-card text-text-primary";
}

export function ItineraryFilterBottomSheet({
  isOpen,
  onClose,
  regions,
  filters,
  onChange,
  onApply,
}: ItineraryFilterBottomSheetProps) {
  if (!isOpen) return null;

  function toggleRegion(id: number) {
    onChange({ ...filters, regionId: filters.regionId === id ? null : id });
  }

  function toggleDuration(value: ItineraryFilters["durationBucket"]) {
    onChange({
      ...filters,
      durationBucket: filters.durationBucket === value ? null : value,
    });
  }

  function clearAll() {
    onChange({ regionId: null, durationBucket: null });
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
                {region.name.split(" - ")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-bold text-text-primary">Duration</h3>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => toggleDuration(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${chipClasses(filters.durationBucket === option.value)}`}
              >
                {option.label}
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

// Maps a duration bucket to the Min/MaxDurationHours pair GetPagedRequest
// expects. Kept alongside the sheet since it's the one place that needs to
// know both the UI buckets and the query param shape.
export function durationBucketToRange(
  bucket: ItineraryFilters["durationBucket"],
): { min?: number; max?: number } {
  switch (bucket) {
    case "short":
      return { max: 1 };
    case "half-day":
      return { min: 2, max: 4 };
    case "full-day":
      return { min: 5 };
    default:
      return {};
  }
}
