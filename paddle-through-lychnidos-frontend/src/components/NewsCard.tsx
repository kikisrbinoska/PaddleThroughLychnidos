import { useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import type { NewsItemListEntry } from "../types";
import { Badge } from "./Badge";
import { formatRelativeDate } from "../utils/relativeDate";
import { getNewsPlaceholder } from "../utils/newsPlaceholder";

export interface NewsCardProps {
  news: NewsItemListEntry;
}

export function NewsCard({ news }: NewsCardProps) {
  const [placeholderFailed, setPlaceholderFailed] = useState(false);
  const imageSrc = news.thumbnailUrl?.trim() || getNewsPlaceholder(news.id);

  return (
    <Link
      to={`/magazine/${news.id}`}
      // No backdrop-blur here - NewsFeedPage renders this in an infinite
      // scroll grid that can grow well past the "long list" threshold, and
      // blur belongs on a section container, not every scrolling item.
      className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-sm"
    >
      <div className="relative h-32 w-full bg-brown-100">
        {placeholderFailed ? (
          <div className="flex h-full w-full items-center justify-center text-brown-500">
            <Newspaper size={28} />
          </div>
        ) : (
          <img
            src={imageSrc}
            alt=""
            onError={() => setPlaceholderFailed(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3">
        <div className="flex items-center gap-1.5">
          <Badge variant="brown">{news.sourceName}</Badge>
          <span className="text-xs text-text-secondary">
            {formatRelativeDate(news.publishedAt)}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-bold text-text-primary">
          {news.title}
        </h3>
        <p className="line-clamp-2 text-xs text-text-secondary">
          {news.summary}
        </p>
      </div>
    </Link>
  );
}
