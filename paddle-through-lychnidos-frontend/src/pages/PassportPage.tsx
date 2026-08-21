import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Stamp, Store } from "lucide-react";
import { passportService } from "../services/passportService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { PassportStamp } from "../types";
import { getCategoryAccent } from "../utils/categoryStyle";

function StampBadge({ stamp }: { stamp: PassportStamp }) {
  const accent = getCategoryAccent(stamp.categoryName);

  return (
    <Link
      to={`/shop/${stamp.shopId}`}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div
        className={`h-20 w-20 overflow-hidden rounded-full bg-primary-100 ring-4 ${accent.ring}`}
      >
        {stamp.thumbnailUrl ? (
          <img
            src={stamp.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-500">
            <Store size={24} />
          </div>
        )}
      </div>
      <p className="line-clamp-2 w-20 text-xs font-semibold text-text-primary">
        {stamp.shopName}
      </p>
    </Link>
  );
}

export function PassportPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/profile/passport" } } });
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    passportService
      .getMine()
      .then((response) => {
        if (!cancelled) setStamps(response.stamps);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load your passport."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isAuthLoading, navigate]);

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">Digital Passport</h1>
      </header>

      <div className="mt-6 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading your passport...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-2 text-primary-900">
              <Stamp size={20} />
              <p className="text-lg font-extrabold">
                {stamps.length} stamp{stamps.length === 1 ? "" : "s"} collected
              </p>
            </div>

            {stamps.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-default p-8 text-center">
                <Stamp size={28} className="text-text-secondary" />
                <p className="text-sm text-text-secondary">
                  Visit shops and leave reviews to start collecting stamps.
                </p>
                <Link
                  to="/shops"
                  className="text-sm font-semibold text-primary-800 underline"
                >
                  Explore shops
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
                {stamps.map((stamp) => (
                  <StampBadge key={stamp.id} stamp={stamp} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
