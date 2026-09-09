import { useEffect, useState } from "react";
import { BadgeCheck, Check, X } from "lucide-react";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../services/errorMessage";
import type { AdminVerificationRequest, VerificationRequestStatus } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";

const TABS: { value: VerificationRequestStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

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
      <label htmlFor="reject-verification-reason" className="text-xs font-semibold text-nosija-red-900">
        Reason for rejection (shown to the artisan)
      </label>
      <textarea
        id="reject-verification-reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        className="resize-none rounded-lg border border-nosija-red-300 bg-white px-3 py-2 text-sm text-text-primary outline-none focus:border-nosija-red-700"
        placeholder="e.g. Please include a clearer photo of your workshop."
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

function VerificationCard({
  request,
  onApprove,
  onReject,
}: {
  request: AdminVerificationRequest;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number, reason: string) => Promise<void>;
}) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isActionable = request.status === "Pending" && onApprove && onReject;

  async function handleApprove() {
    if (!onApprove) return;
    setIsSubmitting(true);
    setError("");
    try {
      await onApprove(request.id);
    } catch (err) {
      setError(getErrorMessage(err, "Could not approve this request."));
      setIsSubmitting(false);
    }
  }

  async function handleReject(reason: string) {
    if (!onReject) return;
    setIsSubmitting(true);
    setError("");
    try {
      await onReject(request.id, reason);
    } catch (err) {
      setError(getErrorMessage(err, "Could not reject this request."));
      setIsSubmitting(false);
    }
  }

  return (
    <Card variant="strong" className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold text-text-primary">{request.shopName}</p>
        <p className="mt-0.5 text-xs text-text-secondary">
          {request.ownerName} · {request.categoryName} · submitted {formatDate(request.submittedAt)}
        </p>
      </div>

      <p className="text-sm text-text-secondary">{request.notes}</p>

      {request.documentUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {request.documentUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-20 w-20 flex-none overflow-hidden rounded-lg border border-border-default"
            >
              <img src={url} alt="Verification document" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}

      {request.status !== "Pending" && (
        <p className="text-xs text-text-secondary">
          {request.status} by {request.reviewedByAdminName ?? "an admin"}
          {request.reviewedAt && ` on ${formatDate(request.reviewedAt)}`}
          {request.rejectionReason && ` - "${request.rejectionReason}"`}
        </p>
      )}

      {error && <p className="text-xs text-nosija-red-700">{error}</p>}

      {isActionable &&
        (isRejecting ? (
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
        ))}
    </Card>
  );
}

export function VerificationRequestsPage() {
  const [tab, setTab] = useState<VerificationRequestStatus>("Pending");
  const [requests, setRequests] = useState<AdminVerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    adminService
      .getVerificationRequests(tab)
      .then((response) => {
        if (!cancelled) setRequests(response.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load verification requests."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tab]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleApprove(id: number) {
    await adminService.approveVerification(id);
    setRequests((current) => current.filter((r) => r.id !== id));
    setToast("Verification approved.");
  }

  async function handleReject(id: number, reason: string) {
    await adminService.rejectVerification(id, reason);
    setRequests((current) => current.filter((r) => r.id !== id));
    setToast("Verification rejected.");
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-primary-900">Verify Artisans</h2>
        {toast && (
          <span className="rounded-full bg-secondary-100 px-3 py-1.5 text-xs font-semibold text-secondary-900">
            {toast}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold ${
              tab === t.value
                ? "border-primary-900 bg-primary-900 text-white"
                : "border-white/70 bg-white/70 text-text-primary backdrop-blur-lg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading requests...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default bg-white/60 p-8 text-center backdrop-blur-lg">
            <BadgeCheck size={28} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              No {tab.toLowerCase()} verification requests.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <VerificationCard
              key={request.id}
              request={request}
              onApprove={tab === "Pending" ? handleApprove : undefined}
              onReject={tab === "Pending" ? handleReject : undefined}
            />
          ))
        )}
      </div>
    </AdminLayout>
  );
}
