import { useEffect, useState } from "react";
import { Plus, Search, Store, Trash2, UserPlus, X } from "lucide-react";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../services/errorMessage";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";
import type { AdminUser } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { Badge } from "../../components/Badge";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.RegularUser]: "Tourist",
  [UserRole.Artisan]: "Artisan",
  [UserRole.Administrator]: "Administrator",
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: UserRole.RegularUser, label: "Tourist" },
  { value: UserRole.Artisan, label: "Artisan" },
  { value: UserRole.Administrator, label: "Administrator" },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface CreateDraft {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

const EMPTY_DRAFT: CreateDraft = {
  name: "",
  username: "",
  email: "",
  password: "",
  role: UserRole.RegularUser,
};

function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [draft, setDraft] = useState<CreateDraft>(EMPTY_DRAFT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setIsSubmitting(true);
    setError("");
    try {
      await adminService.createUser(draft);
      onCreated();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Could not create this user."));
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    draft.name.trim() &&
    draft.username.trim() &&
    draft.email.trim() &&
    draft.password.length >= 8;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
            <UserPlus size={16} />
            Add user
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <TextField
            id="new-user-name"
            label="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <TextField
            id="new-user-username"
            label="Username"
            value={draft.username}
            onChange={(e) => setDraft({ ...draft, username: e.target.value })}
          />
          <TextField
            id="new-user-email"
            label="Email"
            type="email"
            value={draft.email}
            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
          />
          <TextField
            id="new-user-password"
            label="Password"
            type="password"
            value={draft.password}
            onChange={(e) => setDraft({ ...draft, password: e.target.value })}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-user-role" className="text-sm font-medium text-text-primary">
              Role
            </label>
            <select
              id="new-user-role"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: Number(e.target.value) as UserRole })}
              className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-nosija-red-700">{error}</p>}

          <Button onClick={handleSubmit} disabled={isSubmitting || !canSubmit} className="mt-1 w-full">
            {isSubmitting ? "Creating..." : "Create user"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function UserRow({
  user,
  isSelf,
  onRoleChanged,
  onDeleted,
}: {
  user: AdminUser;
  isSelf: boolean;
  onRoleChanged: (id: number, role: UserRole) => void;
  onDeleted: (id: number) => void;
}) {
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function confirmRoleChange() {
    if (pendingRole === null) return;
    setIsSaving(true);
    setError("");
    try {
      await adminService.updateUserRole(user.id, pendingRole);
      onRoleChanged(user.id, pendingRole);
      setPendingRole(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not change this user's role."));
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmDelete() {
    setIsSaving(true);
    setError("");
    try {
      await adminService.deleteUser(user.id);
      onDeleted(user.id);
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete this user."));
      setIsSaving(false);
      setConfirmingDelete(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-text-primary">{user.name}</p>
          <p className="text-xs text-text-secondary">
            @{user.username} · {user.email}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Joined {formatDate(user.createdAt)}
          </p>
          {user.shopName && (
            <p className="mt-1 flex items-center gap-1 text-xs text-text-secondary">
              <Store size={12} className="flex-none" />
              {user.shopName} ({user.shopStatus})
            </p>
          )}
        </div>
        <Badge variant={user.role === UserRole.Administrator ? "nosijaGold" : "primary"}>
          {ROLE_LABELS[user.role]}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border-default pt-3">
        <label htmlFor={`role-${user.id}`} className="text-xs font-semibold text-text-secondary">
          Change role
        </label>
        <select
          id={`role-${user.id}`}
          value={pendingRole ?? user.role}
          disabled={isSelf}
          onChange={(e) => setPendingRole(Number(e.target.value) as UserRole)}
          className="rounded-lg border border-border-default bg-surface-card px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-primary-700 disabled:opacity-50"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            disabled={isSelf}
            aria-label={`Delete ${user.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {isSelf && (
        <p className="text-[11px] text-text-secondary">
          You can't change your own role or delete your own account.
        </p>
      )}

      {pendingRole !== null && pendingRole !== user.role && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-primary-300 bg-primary-100 p-3">
          <p className="text-xs font-semibold text-primary-900">
            Change {user.name} to {ROLE_LABELS[pendingRole]}?
          </p>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={() => setPendingRole(null)}
              className="rounded-full border border-primary-800 px-3 py-1.5 text-xs font-semibold text-primary-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmRoleChange}
              disabled={isSaving}
              className="rounded-full bg-primary-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Confirm"}
            </button>
          </div>
        </div>
      )}

      {confirmingDelete && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-nosija-red-300 bg-nosija-red-100 p-3">
          <p className="text-xs font-semibold text-nosija-red-900">
            Delete {user.name}'s account? This can't be undone.
          </p>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded-full border border-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-nosija-red-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isSaving}
              className="rounded-full bg-nosija-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isSaving ? "Deleting..." : "Confirm delete"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-nosija-red-700">{error}</p>}
    </Card>
  );
}

export function ManageUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function load() {
    setIsLoading(true);
    setError(null);
    adminService
      .getUsers({
        search: search.trim() || undefined,
        roleFilter: roleFilter === "" ? undefined : roleFilter,
        pageSize: 100,
      })
      .then((response) => setUsers(response.items))
      .catch((err) => setError(getErrorMessage(err, "Could not load users.")))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, [search, roleFilter]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleRoleChanged(id: number, role: UserRole) {
    setUsers((current) => current.map((u) => (u.id === id ? { ...u, role } : u)));
    setToast("Role updated.");
  }

  function handleDeleted(id: number) {
    setUsers((current) => current.filter((u) => u.id !== id));
    setToast("User deleted.");
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-900">Manage Users</h2>
        <div className="flex items-center gap-3">
          {toast && (
            <span className="rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-semibold text-secondary-900">
              {toast}
            </span>
          )}
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add User
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username or email"
            className="w-full rounded-xl border border-border-default bg-surface-card py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none focus:border-primary-700"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value === "" ? "" : (Number(e.target.value) as UserRole))
          }
          className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
        >
          <option value="">All roles</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading users...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-text-secondary">No users match this search.</p>
        ) : (
          users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelf={currentUser?.id === user.id}
              onRoleChanged={handleRoleChanged}
              onDeleted={handleDeleted}
            />
          ))
        )}
      </div>

      {isCreateOpen && (
        <CreateUserModal onClose={() => setIsCreateOpen(false)} onCreated={load} />
      )}
    </AdminLayout>
  );
}
