import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  ExternalLink,
  Mail,
  Phone,
  Star,
  X,
} from "lucide-react";
import { shopService } from "../services/shopService";
import { productService } from "../services/productService";
import { travelPlanService } from "../services/travelPlanService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { ProductListItem, ShopDetail } from "../types";
import { CategoryImage } from "../components/CategoryImage";
import { ShopLocationMap } from "../components/ShopLocationMap";
import { ProductCard } from "../components/ProductCard";
import { ReviewsSection } from "../components/ReviewsSection";
import { getCategoryAccent } from "../utils/categoryStyle";

// wa.me needs a full international number with no leading "+" or local
// trunk prefix. Numbers in this dataset are North Macedonian local format
// (e.g. "070 212 046", no country code) - convert 0XXXXXXXX to 389XXXXXXXX.
// Numbers that already include a country code (start with 3 digits other
// than a local trunk "0") are passed through digit-stripped as-is.
function toWhatsAppNumber(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) {
    return `389${digits.slice(1)}`;
  }
  return digits;
}

export function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [travelPlanEntryId, setTravelPlanEntryId] = useState<number | null>(null);
  const [isTogglingPlan, setIsTogglingPlan] = useState(false);
  const [showPlanToast, setShowPlanToast] = useState(false);

  useEffect(() => {
    if (!id) return;
    const shopId = Number(id);
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    Promise.all([
      shopService.getById(shopId),
      productService.getByShopId(shopId),
    ])
      .then(([shopData, productData]) => {
        if (cancelled) return;
        setShop(shopData);
        setProducts(productData);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this shop."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    if (isAuthenticated) {
      travelPlanService
        .getAll()
        .then((plan) => {
          if (cancelled) return;
          const existing = plan.items.find((item) => item.shop?.id === shopId);
          setTravelPlanEntryId(existing?.id ?? null);
        })
        .catch(() => {
          // Non-fatal - the "Add to plan" button just starts unchecked.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (!showPlanToast) return;
    const timer = setTimeout(() => setShowPlanToast(false), 5000);
    return () => clearTimeout(timer);
  }, [showPlanToast]);

  async function toggleTravelPlan() {
    if (!shop) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setIsTogglingPlan(true);
    try {
      if (travelPlanEntryId !== null) {
        await travelPlanService.remove(travelPlanEntryId);
        setTravelPlanEntryId(null);
      } else {
        const response = await travelPlanService.addShop(shop.id);
        setTravelPlanEntryId(response.id);
        setShowPlanToast(true);
      }
    } catch {
      // Leave state unchanged - button label reflects the last known state.
    } finally {
      setIsTogglingPlan(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-900 via-primary-600 to-secondary-800 px-4 text-center">
        <p className="text-white">Loading shop...</p>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-900 via-primary-600 to-secondary-800 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-white">Shop not found</h1>
        <p className="text-white/80">
          {error ?? "This shop could not be found."}
        </p>
        <Link to="/map" className="mt-2 text-sm font-semibold text-white underline">
          Back to map
        </Link>
      </div>
    );
  }

  const accent = getCategoryAccent(shop.categoryName);

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-br from-primary-900 via-primary-600 to-secondary-800">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        {/* 1. Header image */}
        <div className="relative h-64 w-full flex-none">
          <CategoryImage shop={shop} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/45" />

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md"
          >
            <ChevronLeft size={20} />
          </button>

          {shop.isVerified && (
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/50 bg-secondary-900/35 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-lg">
              <Check size={14} />
              Verified artisan
            </span>
          )}
        </div>

        {/* 2. Info card */}
        <div className="relative z-10 -mt-10 mx-4 rounded-2xl border border-white/60 bg-white/55 p-4 shadow-lg shadow-primary-900/10 backdrop-blur-xl">
          <h1 className="text-lg font-medium text-primary-800">{shop.name}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${accent.badgeBg} ${accent.badgeText}`}
            >
              {shop.categoryName}
            </span>
            {shop.regionId !== null && (
              <span className="rounded-full bg-secondary-500/15 px-3 py-1 text-xs font-semibold text-secondary-900">
                {shop.regionName}
              </span>
            )}
          </div>

          {shop.rating !== null && (
            <div className="mt-2 flex items-center gap-1 text-sm text-text-secondary">
              <Star
                size={14}
                className="fill-nosija-gold-700 text-nosija-gold-700"
              />
              <span className="font-semibold text-text-primary">
                {shop.rating.toFixed(1)}
              </span>
              {shop.userRatingCount !== null && (
                <span>({shop.userRatingCount} reviews)</span>
              )}
            </div>
          )}

          {shop.description && (
            <p className="mt-3 text-sm text-text-secondary">
              {shop.description}
            </p>
          )}
        </div>

        {/* 3. Map + contact card */}
        <div className="mx-4 mt-3 rounded-2xl border border-white/55 bg-white/50 p-3.5 backdrop-blur-lg">
          <ShopLocationMap
            latitude={shop.latitude}
            longitude={shop.longitude}
            className="h-40 w-full"
          />

          {shop.address && (
            <p className="mt-2.5 text-xs text-text-secondary">{shop.address}</p>
          )}

          {shop.openingHours && (
            <p className="mt-1 text-xs text-text-secondary">
              {shop.openingHours}
            </p>
          )}

          {shop.phoneNumber && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
              <Phone size={12} className="flex-none" />
              {shop.phoneNumber}
            </p>
          )}

          {(shop.phoneNumber || shop.whatsappNumber || shop.email) && (
            <div className="mt-3 flex gap-2">
              {(shop.whatsappNumber || shop.phoneNumber) && (
                <a
                  href={`https://wa.me/${toWhatsAppNumber(shop.whatsappNumber || shop.phoneNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary-900/90 py-2.5 text-xs font-semibold text-white"
                >
                  <Phone size={14} />
                  Call
                </a>
              )}
              {shop.email && (
                <a
                  href={`mailto:${shop.email}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary-900/90 py-2.5 text-xs font-semibold text-white"
                >
                  <Mail size={14} />
                  Email
                </a>
              )}
            </div>
          )}

          {shop.website && (
            <a
              href={shop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-primary-800 bg-primary-100 py-2.5 text-xs font-semibold text-primary-900"
            >
              <ExternalLink size={14} />
              Visit website
            </a>
          )}
        </div>

        {/* 4. Products */}
        {products.length > 0 && (
          <div className="mx-4 mb-4 mt-3.5">
            <p className="text-sm font-medium text-white">Products</p>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={shop.categoryName}
                />
              ))}
            </div>
          </div>
        )}

        {/* 5. Reviews */}
        <ReviewsSection shopId={shop.id} />
      </div>

      {/* 6. Sticky Add to plan bar - bottom-16 clears the fixed BottomNav
          (h-~64px) which renders on this route and would otherwise sit on
          top of (and intercept clicks on) a bottom-0 sticky bar. */}
      <div className="sticky bottom-16 z-[1200] border-t border-white/50 bg-white/40 p-3.5 backdrop-blur-xl">
        {showPlanToast && (
          <div className="mx-auto mb-3 flex max-w-md items-center justify-between gap-3 rounded-xl bg-secondary-900/90 px-4 py-2.5 text-sm text-white">
            <span>Added to your plan!</span>
            <div className="flex items-center gap-3">
              <Link
                to="/itineraries?view=plan"
                className="font-semibold underline"
              >
                View my plan
              </Link>
              <button
                type="button"
                onClick={() => setShowPlanToast(false)}
                aria-label="Dismiss"
                className="flex h-5 w-5 items-center justify-center"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={toggleTravelPlan}
            disabled={isTogglingPlan}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-900 to-secondary-900 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {travelPlanEntryId !== null ? (
              <>
                <BookmarkCheck size={18} />
                Added to plan
              </>
            ) : (
              <>
                <Bookmark size={18} />
                Add to plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
