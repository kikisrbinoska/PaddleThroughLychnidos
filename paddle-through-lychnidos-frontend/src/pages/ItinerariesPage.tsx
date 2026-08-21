import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  SlidersHorizontal,
  Store,
  Trash2,
} from "lucide-react";
import { itineraryService } from "../services/itineraryService";
import { regionService } from "../services/regionService";
import { travelPlanService } from "../services/travelPlanService";
import { dayPlanService } from "../services/dayPlanService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { DayPlanEntry, ItineraryListItem, Region, TravelPlanEntry } from "../types";
import { ItineraryCard } from "../components/ItineraryCard";
import { Button } from "../components/Button";
import { DayPlanBuilder } from "../components/DayPlanBuilder";
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

type RoutesView = "routes" | "plan";

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

function ViewToggle({
  view,
  onChange,
}: {
  view: RoutesView;
  onChange: (view: RoutesView) => void;
}) {
  const options: { value: RoutesView; label: string }[] = [
    { value: "routes", label: "Curated Routes" },
    { value: "plan", label: "My Plan" },
  ];

  return (
    <div role="radiogroup" aria-label="Routes view" className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = option.value === view;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-primary-900 bg-primary-900 text-white"
                : "border-border-default bg-surface-card text-text-primary hover:border-primary-500"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ShopEntryRow({
  entry,
  onRemove,
  isRemoving,
}: {
  entry: TravelPlanEntry;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  if (!entry.shop) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3">
      <Link
        to={`/shop/${entry.shop.id}`}
        className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100"
      >
        {entry.shop.imageUrl && (
          <img
            src={entry.shop.imageUrl}
            alt={entry.shop.name}
            className="h-full w-full object-cover"
          />
        )}
      </Link>
      <Link to={`/shop/${entry.shop.id}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-primary">
          {entry.shop.name}
        </p>
        <p className="text-xs text-text-secondary">Shop</p>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        aria-label={`Remove ${entry.shop.name} from travel plan`}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function ItineraryEntryRow({
  entry,
  onRemove,
  isRemoving,
}: {
  entry: TravelPlanEntry;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  if (!entry.itinerary) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3">
      <Link
        to={`/itineraries/${entry.itinerary.id}`}
        className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100"
      >
        {entry.itinerary.coverImageUrl && (
          <img
            src={entry.itinerary.coverImageUrl}
            alt={entry.itinerary.title}
            className="h-full w-full object-cover"
          />
        )}
      </Link>
      <Link to={`/itineraries/${entry.itinerary.id}`} className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-primary">
          {entry.itinerary.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-text-secondary">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {entry.itinerary.durationHours}h
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {entry.itinerary.stopCount} stops
          </span>
        </div>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        disabled={isRemoving}
        aria-label={`Remove ${entry.itinerary.title} from travel plan`}
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function DayPlanCard({
  plan,
  onRemove,
  isRemoving,
}: {
  plan: DayPlanEntry;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const formattedDate = new Date(`${plan.date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="rounded-2xl border border-border-default bg-surface-card p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-text-primary">{plan.title}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-text-secondary">
            <Calendar size={11} />
            {formattedDate}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          aria-label={`Delete ${plan.title}`}
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {plan.stops.map((stop) => (
          <Link
            key={stop.order}
            to={`/shop/${stop.shop.id}`}
            className="flex items-center gap-2.5"
          >
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-primary-900 text-[10px] font-bold text-white">
              {stop.order}
            </span>
            <span className="truncate text-xs text-text-primary">{stop.shop.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CuratedRoutesView() {
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
    <>
      <div className="mt-4 flex items-center justify-end">
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

      <div className="mt-4">
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
    </>
  );
}

function MyPlanView() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [entries, setEntries] = useState<TravelPlanEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const [dayPlans, setDayPlans] = useState<DayPlanEntry[]>([]);
  const [isDayPlansLoading, setIsDayPlansLoading] = useState(true);
  const [removingDayPlanId, setRemovingDayPlanId] = useState<number | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  function loadTravelPlan() {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    travelPlanService
      .getAll()
      .then((response) => {
        if (!cancelled) setEntries(response.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load your travel plan."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }

  function loadDayPlans() {
    let cancelled = false;
    setIsDayPlansLoading(true);

    dayPlanService
      .getAll()
      .then((response) => {
        if (!cancelled) setDayPlans(response.plans);
      })
      .catch(() => {
        // Non-fatal - the day plans section just stays empty.
      })
      .finally(() => {
        if (!cancelled) setIsDayPlansLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }

  useEffect(() => {
    if (isAuthLoading || !isAuthenticated) return;
    const cancelTravelPlan = loadTravelPlan();
    const cancelDayPlans = loadDayPlans();
    return () => {
      cancelTravelPlan();
      cancelDayPlans();
    };
  }, [isAuthenticated, isAuthLoading]);

  async function removeEntry(id: number) {
    setRemovingId(id);
    try {
      await travelPlanService.remove(id);
      setEntries((current) => current.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not remove this item."));
    } finally {
      setRemovingId(null);
    }
  }

  async function removeDayPlan(id: number) {
    setRemovingDayPlanId(id);
    try {
      await dayPlanService.remove(id);
      setDayPlans((current) => current.filter((plan) => plan.id !== id));
    } catch {
      // Non-fatal - the plan stays in the list, user can retry.
    } finally {
      setRemovingDayPlanId(null);
    }
  }

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-8 text-center">
        <p className="text-sm text-text-secondary">
          Log in to see the shops and routes you've saved.
        </p>
        <Link to="/login" state={{ from: { pathname: "/itineraries", search: "?view=plan" } }}>
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  const shopEntries = entries.filter((entry) => entry.shop !== null);
  const itineraryEntries = entries.filter((entry) => entry.itinerary !== null);
  const isEmpty = shopEntries.length === 0 && itineraryEntries.length === 0;
  const savedShopSummaries = shopEntries
    .map((entry) => entry.shop)
    .filter((shop): shop is NonNullable<typeof shop> => shop !== null);

  return (
    <div className="mt-6 flex flex-col gap-8">
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">Plan my day</h2>
          <button
            type="button"
            onClick={() => setIsBuilderOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary-900 px-3.5 py-2 text-xs font-semibold text-white"
          >
            <Calendar size={14} />
            New day plan
          </button>
        </div>

        {isDayPlansLoading ? (
          <p className="mt-3 text-sm text-text-secondary">Loading your day plans...</p>
        ) : dayPlans.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">
            Select from your saved places and arrange them into a day plan.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-2.5">
            {dayPlans.map((plan) => (
              <DayPlanCard
                key={plan.id}
                plan={plan}
                onRemove={() => removeDayPlan(plan.id)}
                isRemoving={removingDayPlanId === plan.id}
              />
            ))}
          </div>
        )}
      </section>

      {isLoading ? (
        <p className="text-sm text-text-secondary">Loading your travel plan...</p>
      ) : error ? (
        <p className="text-sm text-text-secondary">{error}</p>
      ) : isEmpty ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-8 text-center">
          <MapPin size={24} className="text-text-secondary" />
          <p className="text-sm text-text-secondary">
            Save shops and routes to build your personal Ohrid itinerary.
          </p>
        </div>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-sm font-bold text-text-primary">
              Saved Shops &amp; Places
            </h2>
            {shopEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-6 text-center">
                <Store size={24} className="text-text-secondary" />
                <p className="text-sm text-text-secondary">
                  You haven't saved any shops yet.
                </p>
                <Link to="/shops">
                  <Button variant="outline">Explore shops</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {shopEntries.map((entry) => (
                  <ShopEntryRow
                    key={entry.id}
                    entry={entry}
                    onRemove={() => removeEntry(entry.id)}
                    isRemoving={removingId === entry.id}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-text-primary">
              Saved Itineraries
            </h2>
            {itineraryEntries.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-6 text-center">
                <MapPin size={24} className="text-text-secondary" />
                <p className="text-sm text-text-secondary">
                  You haven't saved any itineraries yet.
                </p>
                <Link to="/itineraries">
                  <Button variant="outline">Explore itineraries</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {itineraryEntries.map((entry) => (
                  <ItineraryEntryRow
                    key={entry.id}
                    entry={entry}
                    onRemove={() => removeEntry(entry.id)}
                    isRemoving={removingId === entry.id}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {isBuilderOpen && (
        <DayPlanBuilder
          savedShops={savedShopSummaries}
          onClose={() => setIsBuilderOpen(false)}
          onCreated={() => {
            setIsBuilderOpen(false);
            loadDayPlans();
          }}
        />
      )}
    </div>
  );
}

export function ItinerariesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view: RoutesView = searchParams.get("view") === "plan" ? "plan" : "routes";

  function setView(next: RoutesView) {
    setSearchParams(next === "plan" ? { view: "plan" } : {}, { replace: true });
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="px-6 pt-8">
        <h1 className="text-lg font-extrabold text-primary-900">Routes</h1>
        <p className="text-xs text-text-secondary">
          Curated heritage routes and your personal travel plan
        </p>
      </header>

      <div className="mt-6 px-6">
        <ViewToggle view={view} onChange={setView} />

        {view === "routes" ? <CuratedRoutesView /> : <MyPlanView />}
      </div>
    </div>
  );
}
