import { useEffect, useRef, useState } from "react";
import { learnService } from "../services/learnService";
import { getErrorMessage } from "../services/errorMessage";
import { VideoCard } from "../components/VideoCard";
import type { LearnVideoCategory, LearnVideoListItem } from "../types";

const PAGE_SIZE = 12;

const CATEGORY_TABS: { value: LearnVideoCategory; label: string }[] = [
  { value: "TraditionalFood", label: "Food" },
  { value: "Crafts", label: "Crafts" },
];

export function LearnPage() {
  const [category, setCategory] = useState<LearnVideoCategory>("TraditionalFood");
  const [videos, setVideos] = useState<LearnVideoListItem[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination whenever the category tab changes.
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    learnService
      .getVideos({ category, pageNumber: 1, pageSize: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setVideos(response.items);
        setPageNumber(1);
        setTotalPages(response.metadata.totalPages);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Could not load videos."));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  // Infinite scroll: load the next page once the sentinel at the bottom of
  // the grid enters the viewport.
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
        learnService
          .getVideos({ category, pageNumber: nextPage, pageSize: PAGE_SIZE })
          .then((response) => {
            setVideos((current) => [...current, ...response.items]);
            setPageNumber(nextPage);
            setTotalPages(response.metadata.totalPages);
          })
          .catch(() => {
            // Non-fatal - user can keep scrolling/retry later; the grid
            // already shown stays intact.
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
        <h1 className="text-2xl font-extrabold text-nosija-gold-900">Learn</h1>
        <p className="text-text-secondary">
          Discover the traditions of Lychnidos
        </p>
      </header>

      <div className="mt-6 px-6">
        <div
          role="tablist"
          aria-label="Video category"
          className="grid grid-cols-2 gap-3"
        >
          {CATEGORY_TABS.map((tab) => {
            const isSelected = tab.value === category;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setCategory(tab.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
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
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-video animate-pulse rounded-2xl bg-primary-100"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-text-secondary">{error}</p>
        ) : videos.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No videos yet for this category.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
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
