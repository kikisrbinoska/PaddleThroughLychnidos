import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Crown, Pencil, Settings, ShoppingBag, Stamp, Star, Store, Trash2, Wrench } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { userService } from "../services/userService";
import { passportService } from "../services/passportService";
import { reviewService } from "../services/reviewService";
import { travelPlanService } from "../services/travelPlanService";
import { artisanService } from "../services/artisanService";
import { getErrorMessage } from "../services/errorMessage";
import type { PassportStamp, ReviewListItem, UserProfile } from "../types";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { getCategoryAccent } from "../utils/categoryStyle";
import { resolveUploadUrl } from "../utils/resolveUploadUrl";

function MetricCard({ value, label }: { value: number; label: string }) {
  return (
    <Card
      variant="light"
      className="flex flex-1 flex-col items-center gap-0.5 p-4 text-center"
    >
      <p className="text-xl font-extrabold text-primary-900">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </Card>
  );
}

function StampPreviewBadge({ stamp }: { stamp: PassportStamp }) {
  const accent = getCategoryAccent(stamp.categoryName);

  return (
    <Link
      to={`/shop/${stamp.shopId}`}
      className="flex w-16 flex-none flex-col items-center gap-1.5 text-center"
    >
      <div
        className={`h-14 w-14 overflow-hidden rounded-full bg-primary-100 ring-2 ${accent.ring}`}
      >
        {stamp.thumbnailUrl ? (
          <img
            src={resolveUploadUrl(stamp.thumbnailUrl)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-500">
            <Store size={18} />
          </div>
        )}
      </div>
      <p className="line-clamp-1 w-full text-[11px] font-semibold text-text-primary">
        {stamp.shopName}
      </p>
    </Link>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const [toast, setToast] = useState(
    (location.state as { message?: string } | null)?.message ?? null,
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [isPremiumArtisan, setIsPremiumArtisan] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingReviewId, setRemovingReviewId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      userService.getMe(),
      passportService.getMine(),
      reviewService.getAll({ userId: user.id, pageSize: 50 }),
      travelPlanService.getAll(),
      user.role === "Artisan" ? artisanService.getMyShops() : Promise.resolve(null),
    ])
      .then(([profileData, passportData, reviewsData, planData, myShops]) => {
        if (cancelled) return;
        setProfile(profileData);
        setStamps(passportData.stamps);
        setReviews(reviewsData.items);
        setSavedCount(planData.items.length);
        setIsPremiumArtisan(
          myShops?.shops.some((shop) => shop.membershipTier === "Premium") ?? false,
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load your profile."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function removeReview(id: number) {
    setRemovingReviewId(id);
    try {
      await reviewService.remove(id);
      setReviews((current) => current.filter((r) => r.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete this review."));
    } finally {
      setRemovingReviewId(null);
    }
  }

  if (!user) {
    return null;
  }

  const initials = (profile?.name ?? user.name ?? user.username)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-svh pb-24">
      <header className="flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-900 to-secondary-900 text-lg font-bold text-white">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-extrabold text-nosija-red-900">
                {profile?.name ?? user.name}
              </h1>
              {isPremiumArtisan && (
                <Badge variant="nosijaGold" className="flex items-center gap-1">
                  <Crown size={11} />
                  Premium
                </Badge>
              )}
            </div>
            <p className="text-xs text-text-secondary">@{profile?.username ?? user.username}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/profile/settings")}
          aria-label="Settings"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 backdrop-blur-md"
        >
          <Settings size={18} />
        </button>
      </header>

      <div className="mt-6 flex flex-col gap-8 px-6">
        {toast && (
          <p className="rounded-lg bg-nosija-gold-100 px-3 py-2 text-sm font-semibold text-nosija-gold-900">
            {toast}
          </p>
        )}
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading your profile...</p>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : (
          <>
            <section className="flex gap-3">
              <MetricCard value={stamps.length} label="Stamps" />
              <MetricCard value={reviews.length} label="Reviews" />
              <MetricCard value={savedCount} label="Saved" />
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold text-text-primary">
                  Digital Passport
                </h2>
                <Link
                  to="/profile/passport"
                  className="text-xs font-semibold text-secondary-900"
                >
                  View all
                </Link>
              </div>
              {stamps.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  No stamps yet - visit shops and leave reviews to start collecting.
                </p>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {stamps.slice(0, 5).map((stamp) => (
                    <StampPreviewBadge key={stamp.id} stamp={stamp} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-3 text-sm font-bold text-text-primary">My Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-text-secondary">
                  You haven't written any reviews yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {/* Solid (non-blurred) tinted card, not the "light"
                      glass variant - this list can grow to 50 items and
                      the no-blur-on-list-items rule applies. */}
                  {reviews.map((review) => (
                    <Card
                      key={review.id}
                      className="flex flex-col gap-2 border-white/70 bg-white/85"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1 text-nosija-gold-700">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={14}
                              className={
                                index < review.rating
                                  ? "fill-nosija-gold-700 text-nosija-gold-700"
                                  : "text-border-default"
                              }
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/shop/${review.shopId}`}
                            aria-label="Edit review"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeReview(review.id)}
                            disabled={removingReviewId === review.id}
                            aria-label="Delete review"
                            className="flex h-8 w-8 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <Link
                        to={`/shop/${review.shopId}`}
                        className="text-xs font-semibold text-primary-800"
                      >
                        {review.shopName}
                      </Link>
                      <p className="text-sm text-text-secondary">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {user.role === "Artisan" && (
              <section>
                <Link
                  to="/artisan/dashboard"
                  className="flex items-center gap-2 rounded-2xl border border-primary-200/50 bg-primary-100/50 p-4 backdrop-blur-lg"
                >
                  <Wrench size={18} className="text-primary-900" />
                  <p className="text-sm font-bold text-primary-900">
                    Artisan Dashboard
                  </p>
                </Link>
              </section>
            )}

            <section>
              <Link
                to="/itineraries?view=plan"
                className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <Stamp size={18} className="text-primary-900" />
                  <p className="text-sm font-bold text-text-primary">
                    My Travel Plan
                  </p>
                </div>
                <span className="text-xs font-semibold text-secondary-900">
                  {savedCount} saved
                </span>
              </Link>
            </section>

            <section>
              <Link
                to="/cart"
                className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/55 p-4 backdrop-blur-xl"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary-900" />
                  <p className="text-sm font-bold text-text-primary">
                    My List
                  </p>
                </div>
                <span className="text-xs font-semibold text-secondary-900">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </span>
              </Link>
            </section>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-center text-sm font-semibold text-nosija-red-700"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
