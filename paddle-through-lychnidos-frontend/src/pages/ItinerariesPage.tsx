import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, SlidersHorizontal } from "lucide-react";
import { itineraryService } from "../services/itineraryService";
import { regionService } from "../services/regionService";
import { getErrorMessage } from "../services/errorMessage";
import type { ItineraryListItem, Region } from "../types";
import { ItineraryCard } from "../components/ItineraryCard";
import {
  ItineraryFilterBottomSheet,
  durationBucketToRange,
  type ItineraryFilters,
} from "../components/ItineraryFilterBottomSheet";

const PAGE_SIZE = 20;

const EMPTY_FILTERS: ItineraryFilters = {
  regionId: null,
  durationBucket: null,
};

function ItineraryCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border-default bg-surface-card">
      <div className="h-28 w-full bg-primary-100" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-primary-100" />
        <div className="h-3 w-full rounded bg-primary-100" />
        <div className="h-3 w-1/2 rounded bg-primary-100" />
      </div>
    </div>
  );
}

export function ItinerariesPage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<ItineraryFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ItineraryFilters>(EMPTY_FILTERS);

  useEffect(() => {
    regionService.getAll().then(setRegions);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const { min, max } = durationBucketToRange(appliedFilters.durationBucket);

    itineraryService
      .getAll({
        regionId: appliedFilters.regionId ?? undefined,
        minDurationHours: min,
        maxDurationHours: max,
        pageNumber,
        pageSize: PAGE_SIZE,
      })
      .then((response) => {
        if (cancelled) return;
        setItineraries(response.items);
        setTotalCount(response.metadata.totalCount);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load itineraries."));
        }
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
    appliedFilters.regionId,
    appliedFilters.durationBucket,
  ].filter((value) => value !== null).length;

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
        <div>
          <h1 className="text-lg font-extrabold text-primary-900">Itineraries</h1>
          <p className="text-xs text-text-secondary">Curated cultural heritage routes</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/itineraries/travel-plan"
            aria-label="My travel plan"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
          >
            <Bookmark size={18} />
          </Link>
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
        </div>
      </header>

      <div className="mt-6 px-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ItineraryCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : itineraries.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No itineraries match your filters.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {itineraries.map((itinerary) => (
                <ItineraryCard
                  key={itinerary.id}
                  itinerary={itinerary}
                  className="w-full"
                />
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

      <ItineraryFilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        regions={regions}
        filters={draftFilters}
        onChange={setDraftFilters}
        onApply={applyFilters}
      />
    </div>
  );
}
