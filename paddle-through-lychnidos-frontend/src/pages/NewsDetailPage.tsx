import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { newsService } from "../services/newsService";
import { getErrorMessage } from "../services/errorMessage";
import type { NewsItemDetail } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  CurrentEvent: "Happening Now",
  UpcomingEvent: "Upcoming Event",
  Exhibition: "Exhibition",
  GeneralNews: "News",
};

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [news, setNews] = useState<NewsItemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    newsService
      .getById(Number(id))
      .then((response) => {
        if (cancelled) return;
        setNews(response.newsItem);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this story."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-brown-100 px-4 text-center">
        <p className="text-brown-700">Loading story...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-brown-100 px-4 text-center">
        <h1 className="text-2xl font-extrabold text-brown-900">
          Story not found
        </h1>
        <p className="text-brown-700">
          {error ?? "This story could not be found."}
        </p>
        <Link to="/magazine" className="mt-2 text-sm font-semibold text-brown-900 underline">
          Back to Magazine
        </Link>
      </div>
    );
  }

  const publishedDate = new Date(news.publishedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="min-h-svh bg-brown-100 pb-16"
      style={{ fontFamily: "var(--font-serif)" }}
    >
      <div className="mx-auto w-full max-w-2xl px-6 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="mb-4 flex items-center gap-1 text-sm font-semibold text-brown-700"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <ChevronLeft size={18} />
          Back
        </button>

        {/* Masthead */}
        <div className="border-t-4 border-double border-brown-900 pt-3">
          <div className="border-b-4 border-double border-brown-900 pb-3">
            <p
              className="text-center text-xs font-bold uppercase tracking-[0.3em] text-brown-900"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {CATEGORY_LABELS[news.category] ?? news.category}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold leading-tight text-brown-900">
          {news.title}
        </h1>

        {/* Byline */}
        <p
          className="mt-3 text-sm italic text-brown-700"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <span className="font-bold not-italic">via {news.sourceName}</span>
          {" · "}
          {publishedDate}
        </p>

        {/* Thumbnail */}
        {news.thumbnailUrl && (
          <div className="mt-6 border-4 border-brown-700 p-1.5">
            <img
              src={news.thumbnailUrl}
              alt=""
              className="w-full"
              style={{ filter: "sepia(0.3)" }}
            />
          </div>
        )}

        {/* Summary / lede */}
        <p className="mt-6 text-lg leading-loose text-brown-900">
          {news.summary}
        </p>

        {/* Read full article */}
        <a
          href={news.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-md border-2 border-brown-700 px-5 py-3 text-sm font-bold text-brown-700 transition-colors hover:bg-brown-700 hover:text-white"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Read full article on {news.sourceName}
          <ExternalLink size={16} />
        </a>

        {/* Bottom rule + back link */}
        <div className="mt-10 border-t-2 border-brown-900 pt-4 text-center">
          <Link
            to="/magazine"
            className="text-sm font-semibold text-brown-700 underline"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Back to Magazine
          </Link>
        </div>
      </div>
    </div>
  );
}
