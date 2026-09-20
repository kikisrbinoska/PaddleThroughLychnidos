import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { shopService } from "../services/shopService";
import { regionService } from "../services/regionService";
import { newsService } from "../services/newsService";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import type { NewsItemListEntry, Region, ShopListItem } from "../types";
import { HorizontalScrollRow } from "../components/HorizontalScrollRow";
import { ShopCard } from "../components/ShopCard";
import { RegionChip } from "../components/RegionChip";
import { NewsCard } from "../components/NewsCard";
import { BackgroundBlob } from "../components/BackgroundBlob";
import logo from "../assets/logo.png";

interface SectionHeaderProps {
  title: string;
  seeAllTo?: string;
}

function SectionHeader({ title, seeAllTo }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-extrabold text-primary-900">{title}</h2>
        <div className="mt-1 h-[3px] w-10 rounded-full bg-gradient-to-r from-primary-900 to-secondary-900" />
      </div>
      {seeAllTo && (
        <Link
          to={seeAllTo}
          className="text-sm font-semibold text-secondary-900"
        >
          See all
        </Link>
      )}
    </div>
  );
}

function ShopCardSkeleton() {
  return (
    <div className="w-40 flex-none animate-pulse overflow-hidden rounded-2xl border border-white/60 bg-white/55 md:w-full">
      <div className="h-28 w-full bg-primary-100" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded bg-primary-100" />
        <div className="h-3 w-1/2 rounded bg-primary-100" />
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomePage() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [featuredShops, setFeaturedShops] = useState<ShopListItem[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItemListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      // No dedicated "featured" flag exists on the backend yet, and none
      // of the ~80 imported shops are isVerified yet either - so this just
      // shows the first page of real shops until a proper featured/highest
      // rated selection exists.
      shopService.getAll({ pageSize: 10 }),
      regionService.getAll(),
    ])
      .then(([shopsResponse, regionsResponse]) => {
        if (cancelled) return;
        setFeaturedShops(shopsResponse.items);
        setRegions(regionsResponse);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    newsService
      .getAll({ pageSize: 6 })
      .then((response) => {
        if (cancelled) return;
        setLatestNews(response.items);
      })
      .finally(() => {
        if (!cancelled) setIsNewsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-svh overflow-hidden pb-24">
      <BackgroundBlob position="-top-10 -right-16" tint="primary" />
      <BackgroundBlob position="top-40 -left-20" size="h-56 w-56" tint="secondary" />

      <header className="relative flex items-center justify-between px-6 pt-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Paddle through Lychnidos" className="h-14 w-14 object-contain" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {getGreeting()}
            </p>
            <p className="text-lg font-extrabold text-primary-900">
              {user?.name ?? "Explorer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            aria-label="My list"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 shadow-sm shadow-primary-900/10 backdrop-blur-md transition-shadow hover:shadow-md"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-nosija-red-700 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="relative mx-6 mt-6 overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-primary-900 to-secondary-900 px-6 py-6 shadow-lg shadow-primary-900/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
          Lake Ohrid awaits
        </p>
        <p className="mt-1 max-w-xs text-lg font-extrabold text-white">
          Discover artisan shops, routes and stories from Lychnidos
        </p>
        <Link
          to="/shops"
          className="mt-4 inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-900 shadow-sm"
        >
          Start exploring
        </Link>
      </div>

      <div className="relative mt-8 flex flex-col gap-8 px-6">
        <section>
          <SectionHeader title="Artisan Shops" seeAllTo="/shops" />
          {isLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <ShopCardSkeleton key={index} />
              ))}
            </div>
          ) : featuredShops.length === 0 ? (
            <p className="text-sm text-text-secondary">No shops yet.</p>
          ) : (
            <HorizontalScrollRow>
              {featuredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} variant="gradient" />
              ))}
            </HorizontalScrollRow>
          )}
        </section>

        <section>
          <SectionHeader title="Explore by Region" />
          {isLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 w-24 flex-none animate-pulse rounded-2xl bg-primary-100"
                />
              ))}
            </div>
          ) : (
            <HorizontalScrollRow className="md:grid-cols-4 lg:grid-cols-6">
              {regions.map((region, index) => (
                <RegionChip
                  key={region.id}
                  region={region}
                  onClick={(r) => navigate(`/map?regionId=${r.id}`)}
                  variant="gradient"
                  index={index}
                />
              ))}
            </HorizontalScrollRow>
          )}
        </section>

        <section>
          <SectionHeader title="Latest from the Magazine" seeAllTo="/magazine" />
          {isNewsLoading ? (
            <div className="flex gap-3 overflow-hidden">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 w-48 flex-none animate-pulse rounded-2xl bg-primary-100"
                />
              ))}
            </div>
          ) : latestNews.length === 0 ? (
            <p className="text-sm text-text-secondary">No news yet.</p>
          ) : (
            <HorizontalScrollRow>
              {latestNews.map((news) => (
                <div key={news.id} className="w-48 flex-none snap-start md:w-full">
                  <NewsCard news={news} />
                </div>
              ))}
            </HorizontalScrollRow>
          )}
        </section>
      </div>
    </div>
  );
}
