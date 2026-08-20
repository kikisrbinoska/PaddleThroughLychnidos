import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import type { ItineraryListItem } from "../types";
import { Badge } from "./Badge";

export interface ItineraryCardProps {
  itinerary: ItineraryListItem;
  // Overrides the default fixed-width sizing (w-40, meant for horizontal
  // scroll rows) - pass "w-full" when placing this card in a grid instead.
  className?: string;
}

export function ItineraryCard({
  itinerary,
  className = "w-40 flex-none snap-start md:w-full",
}: ItineraryCardProps) {
  return (
    <Link
      to={`/itineraries/${itinerary.id}`}
      className={`overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm ${className}`}
    >
      <div className="relative h-28 w-full">
        {itinerary.coverImageUrl ? (
          <img
            src={itinerary.coverImageUrl}
            alt={itinerary.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-300 to-primary-100" />
        )}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-semibold text-primary-900 shadow">
          <Clock size={11} />
          {itinerary.durationHours}h
        </span>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-bold text-text-primary">
          {itinerary.title}
        </h3>
        <p className="line-clamp-2 text-xs text-text-secondary">
          {itinerary.description}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <Badge variant="primary">{itinerary.regionName.split(" - ")[0]}</Badge>
          <span className="flex items-center gap-1 text-xs text-text-secondary">
            <MapPin size={12} />
            {itinerary.stopCount} stops
          </span>
        </div>
      </div>
    </Link>
  );
}
