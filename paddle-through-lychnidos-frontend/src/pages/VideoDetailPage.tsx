import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { learnService } from "../services/learnService";
import { getErrorMessage } from "../services/errorMessage";
import { Badge } from "../components/Badge";
import { ShopCard } from "../components/ShopCard";
import type { LearnVideoDetail, ShopListItem } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  TraditionalFood: "Traditional Food",
  Crafts: "Crafts",
};

export function VideoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<LearnVideoDetail | null>(null);
  const [relatedShops, setRelatedShops] = useState<ShopListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    learnService
      .getVideoById(Number(id))
      .then((response) => {
        if (cancelled) return;
        setVideo(response.video);
        setRelatedShops(response.relatedShops);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load this video."));
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
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-surface-bg px-4 text-center">
        <p className="text-text-secondary">Loading video...</p>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-2 bg-surface-bg px-4 text-center">
        <h1 className="text-2xl font-extrabold text-primary-900">
          Video not found
        </h1>
        <p className="text-text-secondary">
          {error ?? "This video could not be found."}
        </p>
        <Link to="/learn" className="mt-2 text-sm font-semibold text-primary-800 underline">
          Back to Learn
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-surface-bg pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border-default bg-surface-card text-primary-900"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="truncate text-lg font-extrabold text-primary-900">Learn</h1>
      </header>

      <div className="mt-4 px-6">
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeVideoId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <h2 className="mt-4 text-lg font-bold text-text-primary">
          {video.title}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">{video.channelName}</p>

        <div className="mt-3">
          <Badge variant={video.category === "Crafts" ? "brown" : "nosijaGold"}>
            {CATEGORY_LABELS[video.category] ?? video.category}
          </Badge>
        </div>

        {relatedShops.length > 0 && (
          <section className="mt-8">
            <h3 className="text-lg font-extrabold text-primary-900">
              Related Artisans
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              Shops that practice this craft
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} className="w-full" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
