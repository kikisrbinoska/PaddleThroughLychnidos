import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Clock, MapPin, Store, Trash2 } from "lucide-react";
import { travelPlanService } from "../services/travelPlanService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { TravelPlanEntry } from "../types";
import { Button } from "../components/Button";

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

export function TravelPlanPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [entries, setEntries] = useState<TravelPlanEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/itineraries/travel-plan" } } });
      return;
    }

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
  }, [isAuthenticated, isAuthLoading, navigate]);

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

  const shopEntries = entries.filter((entry) => entry.shop !== null);
  const itineraryEntries = entries.filter((entry) => entry.itinerary !== null);

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">My Travel Plan</h1>
      </header>

      <div className="mt-6 flex flex-col gap-8 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading your travel plan...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
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
      </div>
    </div>
  );
}
