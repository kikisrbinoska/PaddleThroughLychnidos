import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Search, Trash2, X } from "lucide-react";
import { itineraryService } from "../../services/itineraryService";
import { regionService } from "../../services/regionService";
import { shopService } from "../../services/shopService";
import { getErrorMessage } from "../../services/errorMessage";
import type {
  ItineraryDifficulty,
  ItineraryStopInput,
  Region,
  ShopListItem,
} from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";

const DIFFICULTIES: ItineraryDifficulty[] = ["Easy", "Moderate", "Hard"];

interface FormFields {
  title: string;
  description: string;
  coverImageUrl: string;
  durationHours: number;
  regionId: number;
  difficulty: ItineraryDifficulty;
}

const EMPTY_FIELDS: FormFields = {
  title: "",
  description: "",
  coverImageUrl: "",
  durationHours: 1,
  regionId: 0,
  difficulty: "Easy",
};

// Local editing shape for a stop - carries the shop's name/image alongside
// the ShopId so the builder can render something useful without a second
// lookup per row. suggestedTime is edited as plain minutes for a simpler
// input than a raw "hh:mm:ss" text field, converted on save/load.
interface StopDraft {
  key: string;
  shopId: number;
  shopName: string;
  notes: string;
  suggestedMinutes: number;
}

function minutesToTimeSpan(minutes: number): string {
  const total = Math.max(0, Math.round(minutes));
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}:00`;
}

function timeSpanToMinutes(value: string): number {
  const [hh, mm] = value.split(":").map((part) => Number(part) || 0);
  return hh * 60 + mm;
}

function StopBuilder({
  stops,
  onChange,
}: {
  stops: StopDraft[];
  onChange: (stops: StopDraft[]) => void;
}) {
  const [searchWord, setSearchWord] = useState("");
  const [results, setResults] = useState<ShopListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchWord.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    const timer = setTimeout(() => {
      shopService
        .getAll({ searchWord: searchWord.trim(), pageSize: 8 })
        .then((response) => {
          if (!cancelled) setResults(response.items);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchWord]);

  function addStop(shop: ShopListItem) {
    if (stops.some((s) => s.shopId === shop.id)) return;
    onChange([
      ...stops,
      {
        key: `${shop.id}-${Date.now()}`,
        shopId: shop.id,
        shopName: shop.name,
        notes: "",
        suggestedMinutes: 30,
      },
    ]);
    setSearchWord("");
    setResults([]);
  }

  function removeStop(key: string) {
    onChange(stops.filter((s) => s.key !== key));
  }

  function updateStop(key: string, patch: Partial<StopDraft>) {
    onChange(stops.map((s) => (s.key === key ? { ...s, ...patch } : s)));
  }

  function moveStop(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= stops.length) return;
    const next = [...stops];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Search approved shops to add as a stop..."
          className="w-full rounded-xl border border-border-default bg-surface-card py-2.5 pl-9 pr-3 text-sm text-text-primary outline-none focus:border-primary-700"
        />
        {(results.length > 0 || isSearching) && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-border-default bg-surface-card shadow-lg">
            {isSearching ? (
              <p className="px-3 py-2 text-xs text-text-secondary">Searching...</p>
            ) : (
              results.map((shop) => (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => addStop(shop)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-primary-100"
                >
                  <span>{shop.name}</span>
                  <span className="text-xs text-text-secondary">{shop.categoryName}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {stops.length === 0 ? (
        <p className="text-sm text-text-secondary">
          No stops yet - search above to add shops.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {stops.map((stop, index) => (
            <div
              key={stop.key}
              className="flex flex-col gap-2 rounded-xl border border-border-default bg-surface-bg p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-text-primary">
                  {index + 1}. {stop.shopName}
                </p>
                <div className="flex flex-none items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStop(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStop(index, 1)}
                    disabled={index === stops.length - 1}
                    aria-label="Move down"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStop(stop.key)}
                    aria-label="Remove stop"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={stop.notes}
                  onChange={(e) => updateStop(stop.key, { notes: e.target.value })}
                  placeholder="Notes for this stop"
                  className="flex-1 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary outline-none focus:border-primary-700"
                />
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={stop.suggestedMinutes}
                    onChange={(e) =>
                      updateStop(stop.key, { suggestedMinutes: Number(e.target.value) })
                    }
                    className="w-20 rounded-lg border border-border-default bg-surface-card px-3 py-2 text-xs text-text-primary outline-none focus:border-primary-700"
                  />
                  <span className="text-xs text-text-secondary">min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function EditItineraryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== undefined;

  const [regions, setRegions] = useState<Region[]>([]);
  const [fields, setFields] = useState<FormFields>(EMPTY_FIELDS);
  const [stops, setStops] = useState<StopDraft[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    regionService.getAll().then(setRegions);
  }, []);

  useEffect(() => {
    if (!isEditMode || !id) return;
    let cancelled = false;

    itineraryService
      .getById(Number(id))
      .then((itinerary) => {
        if (cancelled) return;
        setFields({
          title: itinerary.title,
          description: itinerary.description,
          coverImageUrl: itinerary.coverImageUrl,
          durationHours: itinerary.durationHours,
          regionId: itinerary.regionId,
          difficulty: itinerary.difficulty,
        });
        setStops(
          itinerary.stops
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((stop) => ({
              key: `${stop.shop.id}-${stop.order}`,
              shopId: stop.shop.id,
              shopName: stop.shop.name,
              notes: stop.notes,
              suggestedMinutes: timeSpanToMinutes(stop.suggestedTime),
            })),
        );
      })
      .catch((err) => setError(getErrorMessage(err, "Could not load this itinerary.")))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, isEditMode]);

  async function handleSubmit() {
    if (!fields.title.trim() || !fields.regionId || stops.length === 0) {
      setError("Title, region, and at least one stop are required.");
      return;
    }

    setIsSaving(true);
    setError("");

    const payloadStops: ItineraryStopInput[] = stops.map((stop) => ({
      shopId: stop.shopId,
      notes: stop.notes,
      suggestedTime: minutesToTimeSpan(stop.suggestedMinutes),
    }));

    try {
      if (isEditMode && id) {
        await itineraryService.update(Number(id), { ...fields, stops: payloadStops });
      } else {
        await itineraryService.create({ ...fields, stops: payloadStops });
      }
      navigate("/admin/itineraries");
    } catch (err) {
      setError(getErrorMessage(err, "Could not save this itinerary."));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-extrabold text-primary-900">
        {isEditMode ? "Edit Itinerary" : "Create Itinerary"}
      </h2>

      {isLoading ? (
        <p className="mt-6 text-sm text-text-secondary">Loading...</p>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          <Card className="flex flex-col gap-4">
            <TextField
              id="itinerary-title"
              label="Title"
              value={fields.title}
              onChange={(e) => setFields({ ...fields, title: e.target.value })}
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="itinerary-description" className="text-sm font-medium text-text-primary">
                Description
              </label>
              <textarea
                id="itinerary-description"
                value={fields.description}
                onChange={(e) => setFields({ ...fields, description: e.target.value })}
                rows={3}
                className="resize-y rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
              />
            </div>
            <TextField
              id="itinerary-cover-image"
              label="Cover Image URL"
              value={fields.coverImageUrl}
              onChange={(e) => setFields({ ...fields, coverImageUrl: e.target.value })}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <TextField
                id="itinerary-duration"
                label="Duration (hours)"
                type="number"
                min={1}
                value={fields.durationHours}
                onChange={(e) =>
                  setFields({ ...fields, durationHours: Number(e.target.value) })
                }
                className="sm:flex-1"
              />
              <div className="flex flex-col gap-1.5 sm:flex-1">
                <label htmlFor="itinerary-region" className="text-sm font-medium text-text-primary">
                  Region
                </label>
                <select
                  id="itinerary-region"
                  value={fields.regionId}
                  onChange={(e) => setFields({ ...fields, regionId: Number(e.target.value) })}
                  className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
                >
                  <option value={0}>Select a region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:flex-1">
                <label htmlFor="itinerary-difficulty" className="text-sm font-medium text-text-primary">
                  Difficulty
                </label>
                <select
                  id="itinerary-difficulty"
                  value={fields.difficulty}
                  onChange={(e) =>
                    setFields({ ...fields, difficulty: e.target.value as ItineraryDifficulty })
                  }
                  className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card>
            <p className="mb-3 text-sm font-bold text-text-primary">Stops</p>
            <StopBuilder stops={stops} onChange={setStops} />
          </Card>

          {error && <p className="text-sm text-nosija-red-700">{error}</p>}

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "Saving..." : isEditMode ? "Save changes" : "Create itinerary"}
            </Button>
            <button
              type="button"
              onClick={() => navigate("/admin/itineraries")}
              className="flex items-center gap-1.5 rounded-full border border-border-default px-5 py-2.5 text-sm font-semibold text-text-primary"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
