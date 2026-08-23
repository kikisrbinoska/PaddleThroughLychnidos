import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BadgeCheck,
  MapPinned,
  MessageSquare,
  Route,
  Store,
  Users,
} from "lucide-react";
import { adminService } from "../../services/adminService";
import { getErrorMessage } from "../../services/errorMessage";
import type { AdminDashboardStats } from "../../types";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/Card";

function MetricCard({
  icon: Icon,
  value,
  label,
  breakdown,
}: {
  icon: typeof Store;
  value: number;
  label: string;
  breakdown?: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon size={16} />
        <p className="text-xs font-semibold">{label}</p>
      </div>
      <p className="text-2xl font-extrabold text-primary-900">{value}</p>
      {breakdown && <p className="text-xs text-text-secondary">{breakdown}</p>}
    </Card>
  );
}

function ActionNeededCard({
  to,
  count,
  label,
}: {
  to: string;
  count: number;
  label: string;
}) {
  if (count === 0) return null;

  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-2xl border border-nosija-gold-500 bg-nosija-gold-100 p-4"
    >
      <div className="flex items-center gap-3">
        <AlertTriangle size={20} className="flex-none text-nosija-gold-900" />
        <p className="text-sm font-bold text-nosija-gold-900">{label}</p>
      </div>
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-nosija-gold-900 px-2 text-xs font-bold text-white">
        {count}
      </span>
    </Link>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    adminService
      .getDashboardStats()
      .then((response) => {
        if (!cancelled) setStats(response);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load dashboard stats."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-xl font-extrabold text-primary-900">Dashboard</h2>

      {isLoading ? (
        <p className="mt-6 text-sm text-text-secondary">Loading stats...</p>
      ) : error ? (
        <p className="mt-6 text-sm text-text-secondary">{error}</p>
      ) : stats ? (
        <>
          <div className="mt-6 flex flex-col gap-3">
            <ActionNeededCard
              to="/admin/shops/pending"
              count={stats.pendingShops}
              label={`${stats.pendingShops} shop${stats.pendingShops === 1 ? "" : "s"} awaiting approval`}
            />
            <ActionNeededCard
              to="/admin/verifications"
              count={stats.pendingVerificationRequests}
              label={`${stats.pendingVerificationRequests} verification request${stats.pendingVerificationRequests === 1 ? "" : "s"} awaiting review`}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <MetricCard
              icon={Store}
              value={stats.totalShops}
              label="Total Shops"
              breakdown={`${stats.pendingShops} pending · ${stats.approvedShops} approved`}
            />
            <MetricCard
              icon={BadgeCheck}
              value={stats.verifiedArtisans}
              label="Verified Artisans"
            />
            <MetricCard
              icon={Users}
              value={stats.totalUsers}
              label="Total Users"
              breakdown={`${stats.artisans} artisans · ${stats.regularUsers} tourists`}
            />
            <MetricCard
              icon={MessageSquare}
              value={stats.totalReviews}
              label="Total Reviews"
            />
            <MetricCard
              icon={Route}
              value={stats.totalItineraries}
              label="Itineraries"
            />
            <MetricCard
              icon={MapPinned}
              value={stats.rejectedShops}
              label="Rejected Shops"
            />
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
}
