import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { shopService } from "../services/shopService";
import { regionService } from "../services/regionService";
import { newsService } from "../services/newsService";
import { useCart } from "../hooks/useCart";
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

export function HomePage() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
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
          <p className="text-sm font-semibold text-text-secondary">Welcome to</p>
          <img src={logo} alt="Paddle through Lychnidos" className="h-20 w-20 object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/cart")}
            aria-label="My list"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/55 text-primary-900 backdrop-blur-md"
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

      <div className="relative mt-8 flex flex-col gap-8 px-6">
        <section>
          <SectionHeader title="Artisan Shops" seeAllTo="/shops" />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
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
            <p className="text-sm text-text-secondary">Loading...</p>
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
            <p className="text-sm text-text-secondary">Loading...</p>
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
