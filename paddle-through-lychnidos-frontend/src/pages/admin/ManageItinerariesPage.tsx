import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { itineraryService } from "../../services/itineraryService";
import { getErrorMessage } from "../../services/errorMessage";
import type { ItineraryListItem } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";

export function ManageItinerariesPage() {
  const [itineraries, setItineraries] = useState<ItineraryListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function load() {
    setIsLoading(true);
    setError(null);
    itineraryService
      .getAll({ pageSize: 100 })
      .then((response) => setItineraries(response.items))
      .catch((err) => setError(getErrorMessage(err, "Could not load itineraries.")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(id: number) {
    setIsDeleting(true);
    try {
      await itineraryService.remove(id);
      setConfirmingDeleteId(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete this itinerary."));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-900">Itineraries</h2>
        <Link
          to="/admin/itineraries/new"
          className="flex items-center gap-1.5 rounded-full bg-primary-900 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus size={16} />
          Create Itinerary
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading itineraries...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : itineraries.length === 0 ? (
          <p className="text-sm text-text-secondary">No itineraries yet.</p>
        ) : (
          itineraries.map((itinerary) => (
            <Card key={itinerary.id} className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-text-primary">
                    {itinerary.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {itinerary.durationHours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {itinerary.stopCount} stops
                    </span>
                    <span>{itinerary.regionName}</span>
                    <span>{itinerary.difficulty}</span>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-1">
                  <Link
                    to={`/admin/itineraries/${itinerary.id}/edit`}
                    aria-label={`Edit ${itinerary.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmingDeleteId(itinerary.id)}
                    aria-label={`Delete ${itinerary.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {confirmingDeleteId === itinerary.id && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-nosija-red-300 bg-nosija-red-100 p-3">
                  <p className="text-xs font-semibold text-nosija-red-900">
                    Delete "{itinerary.title}"? This can't be undone.
                  </p>
                  <div className="flex flex-none gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(null)}
                      className="rounded-full border border-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-nosija-red-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(itinerary.id)}
                      disabled={isDeleting}
                      className="rounded-full bg-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Confirm delete"}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
