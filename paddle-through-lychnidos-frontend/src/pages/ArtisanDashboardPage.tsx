import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BadgeCheck,
  Clock,
  Crown,
  Eye,
  Package,
  Pencil,
  Plus,
  Star,
  Store,
  Bookmark,
} from "lucide-react";
import { artisanService } from "../services/artisanService";
import { getErrorMessage } from "../services/errorMessage";
import type { OwnedShop } from "../types";
import { Card } from "../components/Card";
import { Button } from "../components/Button";

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Eye;
  value: number;
  label: string;
}) {
  return (
    <Card className="flex flex-1 flex-col items-center gap-1 p-3 text-center">
      <Icon size={16} className="text-primary-700" />
      <p className="text-lg font-extrabold text-primary-900">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}

function PendingBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-nosija-gold-500 bg-nosija-gold-100 p-4">
      <Clock size={20} className="mt-0.5 flex-none text-nosija-gold-900" />
      <div>
        <p className="text-sm font-bold text-nosija-gold-900">
          This shop is under review
        </p>
        <p className="mt-1 text-xs text-nosija-gold-900/80">
          We'll notify you once it's approved. This usually takes 2-3
          business days.
        </p>
      </div>
    </div>
  );
}

function RejectedBanner({ shop }: { shop: OwnedShop }) {
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [error, setError] = useState("");
  const [didResubmit, setDidResubmit] = useState(false);

  async function handleResubmit() {
    setIsResubmitting(true);
    setError("");
    try {
      await artisanService.resubmitShop(shop.id);
      setDidResubmit(true);
    } catch (err) {
      setError(getErrorMessage(err, "Could not resubmit your shop."));
    } finally {
      setIsResubmitting(false);
    }
  }

  if (didResubmit) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-nosija-gold-500 bg-nosija-gold-100 p-4">
        <Clock size={20} className="mt-0.5 flex-none text-nosija-gold-900" />
        <p className="text-sm font-bold text-nosija-gold-900">
          Resubmitted for review.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-nosija-red-500 bg-nosija-red-100 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} className="mt-0.5 flex-none text-nosija-red-900" />
        <div>
          <p className="text-sm font-bold text-nosija-red-900">
            This shop was not approved
          </p>
          {shop.rejectionReason && (
            <p className="mt-1 text-xs text-nosija-red-900/80">
              {shop.rejectionReason}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Link to={`/artisan/shops/${shop.id}/edit`} className="flex-1">
          <Button variant="outline" className="w-full">
            Edit shop
          </Button>
        </Link>
        <Button onClick={handleResubmit} disabled={isResubmitting} className="flex-1">
          {isResubmitting ? "Resubmitting..." : "Resubmit for review"}
        </Button>
      </div>
      {error && <p className="text-xs text-nosija-red-700">{error}</p>}
    </div>
  );
}

function ApprovedDashboard({ shop }: { shop: OwnedShop }) {
  return (
    <>
      <div className="grid grid-cols-4 gap-2.5">
        <MetricCard icon={Eye} value={shop.viewCount} label="Views" />
        <MetricCard icon={Bookmark} value={shop.savedCount} label="Saved" />
        <MetricCard icon={Star} value={shop.reviewCount} label="Reviews" />
        <MetricCard
          icon={Star}
          value={shop.rating ? Number(shop.rating.toFixed(1)) : 0}
          label="Rating"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Link
          to={`/artisan/shops/${shop.id}/edit`}
          className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3.5"
        >
          <Pencil size={18} className="text-primary-900" />
          <span className="text-sm font-semibold text-text-primary">
            Edit Shop Profile
          </span>
        </Link>

        <Link
          to={`/artisan/shops/${shop.id}/products`}
          className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3.5"
        >
          <Package size={18} className="text-primary-900" />
          <span className="text-sm font-semibold text-text-primary">
            Manage Products
          </span>
        </Link>

        <Link
          to={`/artisan/shops/${shop.id}/membership`}
          className="flex items-center justify-between gap-3 rounded-2xl border border-border-default bg-surface-card p-3.5"
        >
          <span className="flex items-center gap-3">
            <Crown size={18} className="text-primary-900" />
            <span className="text-sm font-semibold text-text-primary">Membership</span>
          </span>
          <span className="text-xs font-semibold text-secondary-900">
            {shop.membershipTier === "Premium" ? "Premium" : "Free"}
          </span>
        </Link>

        {shop.isVerified ? null : shop.hasPendingVerificationRequest ? (
          <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3.5 opacity-70">
            <Clock size={18} className="text-text-secondary" />
            <span className="text-sm font-semibold text-text-secondary">
              Verification under review
            </span>
          </div>
        ) : (
          <Link
            to={`/artisan/shops/${shop.id}/verification`}
            className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card p-3.5"
          >
            <BadgeCheck size={18} className="text-primary-900" />
            <span className="text-sm font-semibold text-text-primary">
              Request Verification
            </span>
          </Link>
        )}
      </div>
    </>
  );
}

function ShopCard({ shop }: { shop: OwnedShop }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 flex-none overflow-hidden rounded-xl bg-primary-100">
          {shop.imageUrls[0] && (
            <img src={shop.imageUrls[0]} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-text-primary">{shop.name}</p>
            {shop.isVerified && (
              <BadgeCheck size={14} className="flex-none text-secondary-700" />
            )}
            {shop.membershipTier === "Premium" && (
              <Crown size={14} className="flex-none text-nosija-gold-700" />
            )}
          </div>
          <p className="text-xs text-text-secondary">{shop.categoryName}</p>
        </div>
      </div>

      {shop.status === "Pending" ? (
        <PendingBanner />
      ) : shop.status === "Rejected" ? (
        <RejectedBanner shop={shop} />
      ) : (
        <ApprovedDashboard shop={shop} />
      )}
    </Card>
  );
}

export function ArtisanDashboardPage() {
  const [shops, setShops] = useState<OwnedShop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    artisanService
      .getMyShops()
      .then((response) => {
        if (!cancelled) setShops(response.shops);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load your shops."));
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
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center justify-between px-6 pt-8">
        <h1 className="text-lg font-extrabold text-primary-900">Artisan Dashboard</h1>
        {shops.length > 0 && (
          <Link to="/artisan/shop/create">
            <Button className="flex items-center gap-1.5 !px-3 !py-2">
              <Plus size={16} />
            </Button>
          </Link>
        )}
      </header>

      <div className="mt-6 flex flex-col gap-5 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading your shops...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : shops.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-8 text-center">
            <Store size={28} className="text-text-secondary" />
            <p className="text-sm text-text-secondary">
              You haven't set up a shop yet.
            </p>
            <Link to="/artisan/shop/create">
              <Button>Create your shop</Button>
            </Link>
          </div>
        ) : (
          <>
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            <Link to="/artisan/shop/create">
              <Button variant="outline" className="flex w-full items-center justify-center gap-1.5">
                <Plus size={16} />
                Add another shop
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
