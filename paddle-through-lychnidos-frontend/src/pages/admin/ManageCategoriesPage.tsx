import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { categoryService } from "../../services/categoryService";
import { getErrorMessage } from "../../services/errorMessage";
import type { AdminCategory } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";

interface DraftFields {
  name: string;
  iconUrl: string;
}

const EMPTY_DRAFT: DraftFields = { name: "", iconUrl: "" };

function CategoryForm({
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <TextField
        id="category-name"
        label="Name"
        value={draft.name}
        onChange={(e) => onChange({ ...draft, name: e.target.value })}
        className="sm:flex-1"
      />
      <TextField
        id="category-icon"
        label="Icon name/URL"
        value={draft.iconUrl}
        onChange={(e) => onChange({ ...draft, iconUrl: e.target.value })}
        className="sm:flex-1"
      />
      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={isSubmitting || !draft.name.trim()}>
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

export function ManageCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
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

  function load() {
    setIsLoading(true);
    setError(null);
    categoryService
      .getAllForAdmin()
      .then(setCategories)
      .catch((err) => setError(getErrorMessage(err, "Could not load categories.")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleCreate() {
    setIsCreating(true);
    setError(null);
    try {
      await categoryService.create(newDraft);
      setNewDraft(EMPTY_DRAFT);
      load();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create category."));
    } finally {
      setIsCreating(false);
    }
  }

  function startEdit(category: AdminCategory) {
    setEditingId(category.id);
    setEditDraft({ name: category.name, iconUrl: category.iconUrl });
  }

  async function handleSaveEdit() {
    if (editingId === null) return;
    setIsSaving(true);
    setRowError((current) => ({ ...current, [editingId]: "" }));
    try {
      await categoryService.update(editingId, editDraft);
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
      await categoryService.remove(id);
      setConfirmingDeleteId(null);
      load();
    } catch (err) {
      setRowError((current) => ({
        ...current,
        [id]: getErrorMessage(err, "Could not delete this category."),
      }));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AdminLayout>
      <h2 className="text-xl font-extrabold text-primary-900">Categories</h2>

      <Card className="mt-6">
        <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-text-primary">
          <Plus size={16} />
          Add category
        </p>
        <CategoryForm
          draft={newDraft}
          onChange={setNewDraft}
          onSubmit={handleCreate}
          isSubmitting={isCreating}
          submitLabel="Add"
        />
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading categories...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-text-secondary">No categories yet.</p>
        ) : (
          categories.map((category) => (
            <Card key={category.id} className="flex flex-col gap-2">
              {editingId === category.id ? (
                <CategoryForm
                  draft={editDraft}
                  onChange={setEditDraft}
                  onSubmit={handleSaveEdit}
                  onCancel={() => setEditingId(null)}
                  isSubmitting={isSaving}
                  submitLabel="Save"
                />
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{category.name}</p>
                    <p className="text-xs text-text-secondary">
                      {category.iconUrl || "No icon set"} · {category.shopCount} shop
                      {category.shopCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      aria-label={`Edit ${category.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDeleteId(category.id)}
                      aria-label={`Delete ${category.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {confirmingDeleteId === category.id && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-nosija-red-300 bg-nosija-red-100 p-3">
                  <p className="text-xs font-semibold text-nosija-red-900">
                    Delete "{category.name}"? This can't be undone.
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
                      onClick={() => handleDelete(category.id)}
                      disabled={isDeleting}
                      className="rounded-full bg-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {isDeleting ? "Deleting..." : "Confirm delete"}
                    </button>
                  </div>
                </div>
              )}

              {rowError[category.id] && (
                <p className="text-xs text-nosija-red-700">{rowError[category.id]}</p>
              )}
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
