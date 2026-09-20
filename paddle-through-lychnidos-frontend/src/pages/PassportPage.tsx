import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Stamp, Store } from "lucide-react";
import { passportService } from "../services/passportService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { PassportStamp } from "../types";
import { getCategoryAccent } from "../utils/categoryStyle";
import { resolveUploadUrl } from "../utils/resolveUploadUrl";

// Deterministic small tilt per stamp (based on id) so the page reads like
// stamps pressed by hand rather than a perfectly aligned grid.
function stampRotation(id: number): string {
  const angles = [-6, -3, 2, 5, -4, 4, -2, 6];
  return `rotate(${angles[id % angles.length]}deg)`;
}

function StampBadge({ stamp }: { stamp: PassportStamp }) {
  const accent = getCategoryAccent(stamp.categoryName);
  const visitedDate = new Date(stamp.visitedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      to={`/shop/${stamp.shopId}`}
      className="flex flex-col items-center gap-2 text-center"
      style={{ transform: stampRotation(stamp.id) }}
    >
      <div
        className={`relative flex h-24 w-24 items-center justify-center rounded-full border-[3px] border-dashed p-1.5 ${accent.ring.replace("ring-", "border-")}`}
      >
        <div
          className={`h-full w-full overflow-hidden rounded-full bg-primary-100 ring-2 ring-offset-2 ring-offset-transparent ${accent.ring}`}
        >
          {stamp.thumbnailUrl ? (
            <img
              src={resolveUploadUrl(stamp.thumbnailUrl)}
              alt=""
              className="h-full w-full object-cover opacity-90 mix-blend-multiply"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center ${accent.badgeText}`}>
              <Store size={24} />
            </div>
          )}
        </div>
      </div>
      <p className="line-clamp-2 w-24 text-xs font-bold text-text-primary">
        {stamp.shopName}
      </p>
      <p className="text-[10px] uppercase tracking-wide text-text-secondary">
        {stamp.regionName} · {visitedDate}
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
    <div className="min-h-svh pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">Digital Passport</h1>
      </header>

      <div className="mt-6 px-6">
        {/* Passport cover: leather-brown card with gold foil-style seal and
            title, echoing a real travel passport's front cover. */}
        <div className="relative overflow-hidden rounded-3xl border border-brown-700/40 bg-gradient-to-br from-brown-900 to-brown-700 px-6 py-8 text-center shadow-lg shadow-brown-900/30">
          <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-nosija-gold-300/40" />
          <div className="relative flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-nosija-gold-300 text-nosija-gold-200">
              <Stamp size={26} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-nosija-gold-200">
              Paddle Through Lychnidos
            </p>
            <p className="text-xl font-extrabold uppercase tracking-wide text-white">
              Digital Passport
            </p>
            {!isLoading && !error && (
              <p className="mt-1 text-sm font-semibold text-nosija-gold-100">
                {stamps.length} stamp{stamps.length === 1 ? "" : "s"} collected
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-y-6 sm:grid-cols-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="h-24 w-24 animate-pulse rounded-full bg-primary-100" />
                  <div className="h-3 w-16 animate-pulse rounded bg-primary-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-sm text-text-secondary">{error}</p>
          ) : stamps.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-primary-300/60 bg-white/40 p-8 text-center backdrop-blur-md">
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
            <div className="rounded-3xl border border-white/60 bg-[repeating-linear-gradient(180deg,rgba(255,255,255,0.55)_0px,rgba(255,255,255,0.55)_39px,rgba(107,63,29,0.08)_40px)] p-5 shadow-inner backdrop-blur-md">
              <div className="grid grid-cols-3 gap-y-8 sm:grid-cols-4 md:grid-cols-6">
                {stamps.map((stamp) => (
                  <StampBadge key={stamp.id} stamp={stamp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
