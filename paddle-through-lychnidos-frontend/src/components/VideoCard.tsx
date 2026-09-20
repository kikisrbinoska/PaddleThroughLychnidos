import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import type { LearnVideoListItem } from "../types";

export interface VideoCardProps {
  video: LearnVideoListItem;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link
      to={`/learn/video/${video.id}`}
      // No backdrop-blur here - LearnPage renders this in an infinite
      // scroll grid that can grow well past the "long list" threshold, and
      // blur belongs on a section container, not every scrolling item.
      className="overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-md shadow-secondary-900/10 transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative aspect-video w-full bg-primary-100">
        {video.thumbnailUrl && (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <PlayCircle size={32} className="text-white drop-shadow" />
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-bold text-text-primary">
          {video.title}
        </h3>
        <p className="truncate text-xs text-text-secondary">
          {video.channelName}
        </p>
      </div>
    </Link>
  );
}
