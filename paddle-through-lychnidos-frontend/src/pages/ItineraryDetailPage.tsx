import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Clock,
  MapPin,
} from "lucide-react";
import { itineraryService } from "../services/itineraryService";
import { travelPlanService } from "../services/travelPlanService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { ItineraryDetail } from "../types";
import { createItineraryStopIcon } from "../utils/itineraryStopIcon";
import "leaflet/dist/leaflet.css";

function formatSuggestedTime(value: string): string {
  const [hoursStr, minutesStr] = value.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}

interface MapFocusHandlerProps {
  position: [number, number] | null;
}

function MapFocusHandler({ position }: MapFocusHandlerProps) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 0.5 });
    }
  }, [position, map]);

  return null;
}

export function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [itinerary, setItinerary] = useState<ItineraryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [travelPlanEntryId, setTravelPlanEntryId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!id) return;
    const itineraryId = Number(id);
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    itineraryService
      .getById(itineraryId)
      .then((data) => {
        if (!cancelled) setItinerary(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this itinerary."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    if (isAuthenticated) {
      travelPlanService
        .getAll()
        .then((plan) => {
          if (cancelled) return;
          const existing = plan.items.find(
            (item) => item.itinerary?.id === itineraryId,
          );
          setTravelPlanEntryId(existing?.id ?? null);
        })
        .catch(() => {
          // Non-fatal - the save button just starts unchecked.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  const positions = useMemo<[number, number][]>(
    () =>
      itinerary
        ? itinerary.stops
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((stop) => [stop.shop.latitude, stop.shop.longitude])
        : [],
    [itinerary],
  );

  const sortedStops = useMemo(
    () => (itinerary ? [...itinerary.stops].sort((a, b) => a.order - b.order) : []),
    [itinerary],
  );

  const selectedPosition = useMemo<[number, number] | null>(() => {
    if (selectedOrder === null) return null;
    const stop = sortedStops.find((s) => s.order === selectedOrder);
    return stop ? [stop.shop.latitude, stop.shop.longitude] : null;
  }, [selectedOrder, sortedStops]);

  async function toggleSaveItinerary() {
    if (!itinerary) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setIsSaving(true);
    try {
      if (travelPlanEntryId !== null) {
        await travelPlanService.remove(travelPlanEntryId);
        setTravelPlanEntryId(null);
      } else {
        const response = await travelPlanService.addItinerary(itinerary.id);
        setTravelPlanEntryId(response.id);
      }
    } catch {
      // Leave state unchanged - button label reflects the last known state.
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-surface-bg px-4 text-center">
        <p className="text-text-secondary">Loading itinerary...</p>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-surface-bg px-4 text-center">
        <h1 className="text-2xl font-extrabold text-primary-900">
          Itinerary not found
        </h1>
        <p className="text-text-secondary">
          {error ?? "This itinerary could not be found."}
        </p>
        <Link
          to="/itineraries"
          className="mt-2 text-sm font-semibold text-primary-800 underline"
        >
          Back to itineraries
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-28">
      <div className="relative h-48 w-full">
        {itinerary.coverImageUrl ? (
          <img
            src={itinerary.coverImageUrl}
            alt={itinerary.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-300 to-primary-100" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="absolute inset-x-4 bottom-3 text-white">
          <h1 className="text-xl font-extrabold">{itinerary.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
              <Clock size={12} />
              {itinerary.durationHours}h
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
              <MapPin size={12} />
              {itinerary.stops.length} stops
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur-md">
              {itinerary.difficulty}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pt-4">
        {itinerary.description && (
          <p className="text-sm text-text-secondary">{itinerary.description}</p>
        )}

        {positions.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border-default">
            <MapContainer
              center={positions[0]}
              zoom={16}
              scrollWheelZoom={false}
              className="h-56 w-full"
              ref={mapRef}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline
                positions={positions}
                pathOptions={{ color: "#1570EF", weight: 3, dashArray: "6 6" }}
              />
              {sortedStops.map((stop) => (
                <Marker
                  key={stop.order}
                  position={[stop.shop.latitude, stop.shop.longitude]}
                  icon={createItineraryStopIcon(stop.order, stop.order === selectedOrder)}
                  eventHandlers={{
                    click: () => setSelectedOrder(stop.order),
                  }}
                />
              ))}
              <MapFocusHandler position={selectedPosition} />
            </MapContainer>
          </div>
        )}

        <h2 className="mb-3 mt-6 text-sm font-bold text-text-primary">Stops</h2>
        <ol className="flex flex-col gap-3">
          {sortedStops.map((stop, index) => {
            const isSelected = stop.order === selectedOrder;
            const nextStop = sortedStops[index + 1];

            return (
              <li key={stop.order}>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(stop.order)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors ${
                    isSelected
                      ? "border-secondary-700 bg-secondary-100/60"
                      : "border-border-default bg-surface-card"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full text-xs font-bold text-white ${
                      isSelected ? "bg-secondary-900" : "bg-primary-900"
                    }`}
                  >
                    {stop.order}
                  </span>

                  <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100">
                    {stop.shop.imageUrl && (
                      <img
                        src={stop.shop.imageUrl}
                        alt={stop.shop.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-text-primary">
                      {stop.shop.name}
                    </p>
                    {stop.notes && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">
                        {stop.notes}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatSuggestedTime(stop.suggestedTime)} here
                      </span>
                    </div>
                  </div>
                </button>

                {nextStop && (
                  <div className="ml-[3.15rem] mt-1.5 border-l-2 border-dashed border-border-default pl-3 text-[11px] text-text-secondary">
                    Next: {nextStop.shop.name}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-[900] border-t border-border-default bg-surface-card/95 p-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={toggleSaveItinerary}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-900 to-secondary-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {travelPlanEntryId !== null ? (
              <>
                <BookmarkCheck size={18} />
                Saved to travel plan
              </>
            ) : (
              <>
                <Bookmark size={18} />
                Save entire itinerary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
