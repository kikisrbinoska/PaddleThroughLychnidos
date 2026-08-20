import { useEffect, useRef, useState } from "react";
import { newsService } from "../services/newsService";
import { getErrorMessage } from "../services/errorMessage";
import { NewsCard } from "../components/NewsCard";
import type { NewsItemCategory, NewsItemListEntry } from "../types";

const PAGE_SIZE = 12;

const CATEGORY_TABS: { value: NewsItemCategory | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "CurrentEvent", label: "Now" },
  { value: "UpcomingEvent", label: "Upcoming" },
  { value: "Exhibition", label: "Exhibitions" },
];

export function NewsFeedPage() {
  const [category, setCategory] = useState<NewsItemCategory | "All">("All");
  const [news, setNews] = useState<NewsItemListEntry[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    newsService
      .getAll({
        category: category === "All" ? undefined : category,
        pageNumber: 1,
        pageSize: PAGE_SIZE,
      })
      .then((response) => {
        if (cancelled) return;
        setNews(response.items);
        setPageNumber(1);
        setTotalPages(response.metadata.totalPages);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load news."));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoading &&
        !isLoadingMore &&
        pageNumber < totalPages
      ) {
        setIsLoadingMore(true);
        const nextPage = pageNumber + 1;
        newsService
          .getAll({
            category: category === "All" ? undefined : category,
            pageNumber: nextPage,
            pageSize: PAGE_SIZE,
          })
          .then((response) => {
            setNews((current) => [...current, ...response.items]);
            setPageNumber(nextPage);
            setTotalPages(response.metadata.totalPages);
          })
          .catch(() => {
            // Non-fatal - user can keep scrolling/retry later.
          })
          .finally(() => setIsLoadingMore(false));
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [category, pageNumber, totalPages, isLoading, isLoadingMore]);

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="px-6 pt-8">
        <h1 className="text-2xl font-extrabold text-primary-900">Magazine</h1>
        <p className="text-text-secondary">
          Stories, events, and news from around Ohrid
        </p>
      </header>

      <div className="mt-6 overflow-x-auto px-6">
        <div role="tablist" aria-label="News category" className="flex gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isSelected = tab.value === category;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setCategory(tab.value)}
                className={`flex-none rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isSelected
                    ? "border-primary-900 bg-primary-900 text-white"
                    : "border-border-default bg-surface-card text-text-primary hover:border-primary-500"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 px-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-2xl bg-brown-100"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : news.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No news yet for this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
            <div ref={sentinelRef} className="h-1" />
            {isLoadingMore && (
              <p className="mt-4 text-center text-xs text-text-secondary">
                Loading more...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
