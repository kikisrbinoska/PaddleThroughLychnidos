import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { shopService } from "../services/shopService";
import { regionService } from "../services/regionService";
import type { Region, ShopListItem } from "../types";
import { HorizontalScrollRow } from "../components/HorizontalScrollRow";
import { ShopCard } from "../components/ShopCard";
import { RegionChip } from "../components/RegionChip";
import { mockNews } from "../data/mockNews";
import { mockOpenNowShops } from "../data/mockOpenNowShops";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      // No dedicated "featured" flag exists on the backend yet - using
      // isVerified shops as a stand-in until one is added.
      shopService.getAll({ pageSize: 10 }),
      regionService.getAll(),
    ])
      .then(([shopsResponse, regionsResponse]) => {
        if (cancelled) return;
        setFeaturedShops(
          shopsResponse.items.filter((shop) => shop.isVerified),
        );
        setRegions(regionsResponse);
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
          <SectionHeader title="Featured Artisans" seeAllTo="/products" />
          {isLoading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : featuredShops.length === 0 ? (
            <p className="text-sm text-text-secondary">
              No featured artisans yet.
            </p>
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
          <SectionHeader title="Open Now" />
          {/*
            Placeholder section: GET /api/shops has no "open now" filter and
            Shop.OpeningHours is free-text, not structured data, so this
            can't be computed reliably yet. Needs either a backend
            isOpenNow flag or structured opening-hours fields.
          */}
          <HorizontalScrollRow>
            {mockOpenNowShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </HorizontalScrollRow>
        </section>

        <section>
          <SectionHeader title="Latest from the Magazine" seeAllTo="/magazine" />
          {/* Placeholder data - no Magazine endpoint exists yet. */}
          <HorizontalScrollRow>
            {mockNews.map((news) => (
              <Link
                key={news.id}
                to="/magazine"
                className="w-48 flex-none snap-start overflow-hidden rounded-2xl border border-border-default bg-surface-card shadow-sm md:w-full"
              >
                <div className="flex h-24 w-full items-center justify-center bg-secondary-100 text-xs text-secondary-900">
                  No image
                </div>
                <div className="flex flex-col gap-1 p-3">
                  <h3 className="line-clamp-1 text-sm font-bold text-text-primary">
                    {news.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-text-secondary">
                    {news.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </HorizontalScrollRow>
        </section>
      </div>
    </div>
  );
}
