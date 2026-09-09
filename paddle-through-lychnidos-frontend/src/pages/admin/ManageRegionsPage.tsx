import { useEffect, useState } from "react";
import { MapPinned, Pencil, Plus, Trash2, X } from "lucide-react";
import { regionService } from "../../services/regionService";
import { getErrorMessage } from "../../services/errorMessage";
import type { AdminRegion } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";

interface DraftFields {
  name: string;
  description: string;
  polygonGeoJson: string;
}

const EMPTY_DRAFT: DraftFields = { name: "", description: "", polygonGeoJson: "" };

function RegionForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}: {
  draft: DraftFields;
  onChange: (fields: DraftFields) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <TextField
          id="region-name"
          label="Name"
          value={draft.name}
          onChange={(e) => onChange({ ...draft, name: e.target.value })}
          className="sm:flex-1"
        />
        <TextField
          id="region-description"
          label="Description"
          value={draft.description}
          onChange={(e) => onChange({ ...draft, description: e.target.value })}
          className="sm:flex-1"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="region-geojson" className="text-sm font-medium text-text-primary">
          Polygon GeoJSON
        </label>
        <textarea
          id="region-geojson"
          value={draft.polygonGeoJson}
          onChange={(e) => onChange({ ...draft, polygonGeoJson: e.target.value })}
          rows={4}
          className="resize-y rounded-xl border border-border-default bg-surface-card px-4 py-2.5 font-mono text-xs text-text-primary outline-none focus:border-primary-700"
          placeholder='{"type":"Polygon","coordinates":[[[...]]]}'
        />
      </div>
      <div className="flex gap-2">
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !draft.name.trim()}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default text-text-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ManageRegionsPage() {
  const [regions, setRegions] = useState<AdminRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<number, string>>({});

  const [newDraft, setNewDraft] = useState<DraftFields>(EMPTY_DRAFT);
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<DraftFields>(EMPTY_DRAFT);
  const [isSaving, setIsSaving] = useState(false);

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isBackfilling, setIsBackfilling] = useState(false);
  const [backfillMessage, setBackfillMessage] = useState<string | null>(null);

  function load() {
    setIsLoading(true);
    setError(null);
    regionService
      .getAllForAdmin()
      .then(setRegions)
      .catch((err) => setError(getErrorMessage(err, "Could not load regions.")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    setIsCreating(true);
    setError(null);
    try {
      await regionService.create(newDraft);
      setNewDraft(EMPTY_DRAFT);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create region."));
    } finally {
      setIsCreating(false);
    }
  }

  function startEdit(region: AdminRegion) {
    setEditingId(region.id);
    setEditDraft({
      name: region.name,
      description: region.description,
      polygonGeoJson: region.polygonGeoJson,
    });
  }

  async function handleSaveEdit() {
    if (editingId === null) return;
    setIsSaving(true);
    setRowError((current) => ({ ...current, [editingId]: "" }));
    try {
      await regionService.update(editingId, editDraft);
      setEditingId(null);
      load();
    } catch (err) {
      setRowError((current) => ({
        ...current,
        [editingId]: getErrorMessage(err, "Could not save changes."),
      }));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setIsDeleting(true);
    setRowError((current) => ({ ...current, [id]: "" }));
    try {
      await regionService.remove(id);
      setConfirmingDeleteId(null);
      load();
    } catch (err) {
      setRowError((current) => ({
        ...current,
        [id]: getErrorMessage(err, "Could not delete this region."),
      }));
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleBackfill() {
    setIsBackfilling(true);
    setBackfillMessage(null);
    try {
      const result = await regionService.backfillShopRegions();
      setBackfillMessage(result.message);
      load();
    } catch (err) {
      setBackfillMessage(getErrorMessage(err, "Could not backfill shop regions."));
    } finally {
      setIsBackfilling(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-primary-900">Regions</h2>
        <div className="flex items-center gap-3">
          {backfillMessage && (
            <span className="text-xs font-semibold text-secondary-900">{backfillMessage}</span>
          )}
          <Button
            variant="outline"
            onClick={handleBackfill}
            disabled={isBackfilling}
            className="flex items-center gap-1.5"
          >
            <MapPinned size={14} />
            {isBackfilling ? "Matching shops..." : "Backfill shop regions"}
          </Button>
        </div>
      </div>

      <Card variant="strong" className="mt-6">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-text-primary">
          <Plus size={16} />
          Add region
        </p>
        <RegionForm
          draft={newDraft}
          onChange={setNewDraft}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitLabel="Add"
        />
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading regions...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : regions.length === 0 ? (
          <p className="text-sm text-text-secondary">No regions yet.</p>
        ) : (
          regions.map((region) => (
            <Card key={region.id} variant="strong" className="flex flex-col gap-2">
              {editingId === region.id ? (
                <RegionForm
                  draft={editDraft}
                  onChange={setEditDraft}
                  onSubmit={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                  isSubmitting={isSaving}
                  submitLabel="Save"
                />
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary">{region.name}</p>
                    <p className="mt-0.5 text-xs text-text-secondary">
                      {region.description || "No description"}
                    </p>
                    <p className="mt-1 text-xs text-text-secondary">
                      {region.shopCount} shop{region.shopCount === 1 ? "" : "s"} ·{" "}
                      {region.itineraryCount} itinerary(ies)
                    </p>
                  </div>
                  <div className="flex flex-none items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(region)}
                      aria-label={`Edit ${region.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(region.id)}
                      aria-label={`Delete ${region.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {confirmingDeleteId === region.id && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-nosija-red-300 bg-nosija-red-100 p-3">
                  <p className="text-xs font-semibold text-nosija-red-900">
                    Delete "{region.name}"? Shops using it will be unassigned, not deleted
                    {region.itineraryCount > 0 && " - itineraries using it must be reassigned first"}.
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
                      onClick={() => handleDelete(region.id)}
                      disabled={isDeleting}
                      className="rounded-full bg-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Confirm delete"}
                    </button>
                  </div>
                </div>
              )}

              {rowError[region.id] && (
                <p className="text-xs text-nosija-red-700">{rowError[region.id]}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
