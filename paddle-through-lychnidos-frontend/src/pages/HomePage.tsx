import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, Search } from "lucide-react";
import { shopService } from "../services/shopService";
import { regionService } from "../services/regionService";
import { newsService } from "../services/newsService";
import type { NewsItemListEntry, Region, ShopListItem } from "../types";
import { HorizontalScrollRow } from "../components/HorizontalScrollRow";
import { ShopCard } from "../components/ShopCard";
import { RegionChip } from "../components/RegionChip";

interface SectionHeaderProps {
  title: string;
  seeAllTo?: string;
}

function SectionHeader({ title, seeAllTo }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-extrabold text-primary-900">{title}</h2>
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
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center justify-between px-6 pt-8">
        <div>
          <p className="text-xs text-text-secondary">Welcome to</p>
          <h1 className="bg-gradient-to-r from-primary-900 to-secondary-900 bg-clip-text text-lg font-extrabold text-transparent">
            Paddle through Lychnidos
          </h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/map")}
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <Search size={18} />
        </button>
      </header>

      <div className="mt-8 flex flex-col gap-8 px-6">
        <section>
          <SectionHeader title="Artisan Shops" seeAllTo="/shops" />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : featuredShops.length === 0 ? (
            <p className="text-sm text-text-secondary">No shops yet.</p>
          ) : (
            <HorizontalScrollRow>
              {featuredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
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
              {regions.map((region) => (
                <RegionChip
                  key={region.id}
                  region={region}
                  onClick={(r) => navigate(`/map?regionId=${r.id}`)}
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
                <Link
                  key={news.id}
                  to={`/magazine/${news.id}`}
                  className="w-48 flex-none snap-start overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm md:w-full"
                >
                  <div className="flex h-24 w-full items-center justify-center bg-brown-100 text-brown-500">
                    {news.thumbnailUrl ? (
                      <img
                        src={news.thumbnailUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Newspaper size={24} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <h3 className="line-clamp-1 text-sm font-bold text-text-primary">
                      {news.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-text-secondary">
                      {news.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </HorizontalScrollRow>
          )}
        </section>
      </div>
    </div>
  );
}
