import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronUp, Mail, Store, X } from "lucide-react";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../services/errorMessage";
import type { AdminPendingShop } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function RejectForm({
  onCancel,
  onConfirm,
  isSubmitting,
}: {
  onCancel: () => void;
  onConfirm: (reason: string) => void;
  isSubmitting: boolean;
}) {
  const [reason, setReason] = useState("");

  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-nosija-red-300 bg-nosija-red-100 p-3">
      <label htmlFor="reject-reason" className="text-xs font-semibold text-nosija-red-900">
        Reason for rejection (shown to the artisan)
      </label>
      <textarea
        id="reject-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        className="resize-none rounded-lg border border-nosija-red-300 bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-nosija-red-700"
        placeholder="e.g. Please add a physical address and at least one product photo."
      />
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 !border-nosija-red-700 !text-nosija-red-700"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 !bg-nosija-red-700"
          onClick={() => onConfirm(reason)}
          disabled={isSubmitting || !reason.trim()}
        >
          {isSubmitting ? "Rejecting..." : "Confirm reject"}
        </Button>
      </div>
    </div>
  );
}

function PendingShopCard({
  shop,
  onApprove,
  onReject,
}: {
  shop: AdminPendingShop;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleApprove() {
    setIsSubmitting(true);
    setError("");
    try {
      await onApprove(shop.id);
    } catch (err) {
      setError(getErrorMessage(err, "Could not approve this shop."));
      setIsSubmitting(false);
    }
  }

  async function handleReject(reason: string) {
    setIsSubmitting(true);
    setError("");
    try {
      await onReject(shop.id, reason);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reject this shop."));
      setIsSubmitting(false);
    }
  }

  return (
    <Card variant="strong" className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsExpanded((v) => !v)}
        className="flex items-start justify-between gap-3 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-text-primary">{shop.name}</p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {shop.categoryName} · {shop.regionName}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {shop.ownerName} · submitted {formatDate(shop.createdAt)}
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="flex-none text-text-secondary" />
        ) : (
          <ChevronDown size={18} className="flex-none text-text-secondary" />
        )}
      </button>

      {isExpanded && (
        <div className="flex flex-col gap-2 rounded-xl bg-primary-100/40 p-3 text-sm text-text-secondary">
          <p className="flex items-center gap-1.5">
            <Mail size={12} className="flex-none" />
            {shop.ownerEmail || "No email on file"}
          </p>
          <p>{shop.description || "No description provided."}</p>
        </div>
      )}

      {error && <p className="text-xs text-nosija-red-700">{error}</p>}

      {isRejecting ? (
        <RejectForm
          onCancel={() => setIsRejecting(false)}
          onConfirm={handleReject}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center gap-1.5 !border-nosija-red-700 !text-nosija-red-700"
            onClick={() => setIsRejecting(true)}
            disabled={isSubmitting}
          >
            <X size={14} />
            Reject
          </Button>
          <Button
            className="flex flex-1 items-center justify-center gap-1.5"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            <Check size={14} />
            {isSubmitting ? "Approving..." : "Approve"}
          </Button>
        </div>
      )}
    </Card>
  );
}

export function PendingShopsPage() {
  const [shops, setShops] = useState<AdminPendingShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    adminService
      .getPendingShops()
      .then((response) => {
        if (!cancelled) setShops(response.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load pending shops."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleApprove(id: number) {
    await adminService.approveShop(id);
    setShops((current) => current.filter((s) => s.id !== id));
    setToast("Shop approved.");
  }

  async function handleReject(id: number, reason: string) {
    await adminService.rejectShop(id, reason);
    setShops((current) => current.filter((s) => s.id !== id));
    setToast("Shop rejected.");
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-900">Shop Approvals</h2>
        {toast && (
          <span className="rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-semibold text-secondary-900">
            {toast}
          </span>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading pending shops...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default bg-white/60 p-8 text-center backdrop-blur-lg">
            <Store size={28} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              No shops are waiting for approval right now.
            </p>
          </div>
        ) : (
          shops.map((shop) => (
            <PendingShopCard
              key={shop.id}
              shop={shop}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </AdminLayout>
  );
}
