import { useState } from "react";
import { ArrowDown, ArrowUp, Calendar, X } from "lucide-react";
import { dayPlanService } from "../services/dayPlanService";
import { getErrorMessage } from "../services/errorMessage";
import type { TravelPlanShopSummary } from "../types";
import { Button } from "./Button";
import { TextField } from "./TextField";

export interface DayPlanBuilderProps {
  savedShops: TravelPlanShopSummary[];
  onClose: () => void;
  onCreated: () => void;
}

function todayIsoDate(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

export function DayPlanBuilder({ savedShops, onClose, onCreated }: DayPlanBuilderProps) {
  const [title, setTitle] = useState("My day in Ohrid");
  const [date, setDate] = useState(todayIsoDate());
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleShop(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }

  function moveStop(index: number, direction: -1 | 1) {
    setSelectedIds((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Give your day plan a title.");
      return;
    }
    if (selectedIds.length === 0) {
      setError("Select at least one saved place.");
      return;
    }

    setError("");
    setIsSaving(true);
    try {
      await dayPlanService.create({
        title: title.trim(),
        date,
        shopIds: selectedIds,
      });
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create your day plan."));
    } finally {
      setIsSaving(false);
    }
  }

  const orderedSelection = selectedIds
    .map((id) => savedShops.find((s) => s.id === id))
    .filter((s): s is TravelPlanShopSummary => s !== undefined);

  return (
    <div className="fixed inset-0 z-[1300] flex items-end justify-center bg-black/40 md:items-center">
      <div className="flex max-h-[90vh] w-full flex-col overflow-y-auto rounded-t-3xl border border-border-default bg-surface-card p-6 md:max-w-md md:rounded-3xl">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border-default md:hidden" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-primary-900">
            <Calendar size={18} />
            Plan my day
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <TextField
            id="dayPlanTitle"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            id="dayPlanDate"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div>
            <h3 className="mb-2 text-sm font-bold text-text-primary">
              Select from your saved places
            </h3>
            {savedShops.length === 0 ? (
              <p className="text-sm text-text-secondary">
                You don't have any saved places yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {savedShops.map((shop) => {
                  const isSelected = selectedIds.includes(shop.id);
                  return (
                    <button
                      key={shop.id}
                      type="button"
                      onClick={() => toggleShop(shop.id)}
                      aria-pressed={isSelected}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left ${
                        isSelected
                          ? "border-primary-900 bg-primary-100"
                          : "border-border-default bg-surface-card"
                      }`}
                    >
                      <div className="h-10 w-10 flex-none overflow-hidden rounded-lg bg-primary-100">
                        {shop.imageUrl && (
                          <img
                            src={shop.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text-primary">
                        {shop.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {orderedSelection.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-text-primary">
                Your day, in order
              </h3>
              <div className="flex flex-col gap-2">
                {orderedSelection.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-card px-3 py-2"
                  >
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary-900 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                      {shop.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveStop(index, -1)}
                        disabled={index === 0}
                        aria-label={`Move ${shop.name} earlier`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100 disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStop(index, 1)}
                        disabled={index === orderedSelection.length - 1}
                        aria-label={`Move ${shop.name} later`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100 disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-nosija-red-700">{error}</p>}

          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Save day plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
