import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Pencil, Stamp, Star, Trash2, X } from "lucide-react";
import { reviewService } from "../services/reviewService";
import { getErrorMessage } from "../services/errorMessage";
import { useAuth } from "../hooks/useAuth";
import type { ReviewListItem } from "../types";
import { Button } from "./Button";

export interface ReviewsSectionProps {
  shopId: number;
}

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {Array.from({ length: 5 }).map((_, index) => {
        const rating = index + 1;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
            onClick={() => onChange(rating)}
            className="p-0.5"
          >
            <Star
              size={22}
              strokeWidth={2.25}
              className={
                rating <= value
                  ? "fill-nosija-gold-700 text-nosija-gold-700"
                  : "fill-transparent text-primary-900"
              }
            />
          </button>
        );
      })}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={13}
          className={
            index < rating
              ? "fill-nosija-gold-700 text-nosija-gold-700"
              : "text-border-default"
          }
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ shopId }: ReviewsSectionProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [draftRating, setDraftRating] = useState(0);
  const [draftComment, setDraftComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [stampToastVisible, setStampToastVisible] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const myReview = reviews.find((r) => r.userId === user?.id) ?? null;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    reviewService
      .getByShopId(shopId, { pageSize: 50 })
      .then((response) => {
        if (!cancelled) setReviews(response.items);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load reviews."));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId]);

  useEffect(() => {
    if (!stampToastVisible) return;
    const timer = setTimeout(() => setStampToastVisible(false), 6000);
    return () => clearTimeout(timer);
  }, [stampToastVisible]);

  function startWriting() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setDraftRating(myReview?.rating ?? 0);
    setDraftComment(myReview?.comment ?? "");
    setFormError("");
    setIsEditing(true);
  }

  async function submitReview() {
    if (draftRating < 1 || draftRating > 5) {
      setFormError("Please select a rating.");
      return;
    }
    if (!draftComment.trim()) {
      setFormError("Please write a comment.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    try {
      if (myReview) {
        const updated = await reviewService.update(myReview.id, draftRating, draftComment.trim());
        setReviews((current) =>
          current.map((r) =>
            r.id === updated.id ? { ...r, rating: updated.rating, comment: updated.comment } : r,
          ),
        );
      } else {
        const created = await reviewService.create(shopId, draftRating, draftComment.trim());
        setReviews((current) => [
          {
            id: created.id,
            userId: created.userId,
            userName: user?.username ?? "You",
            shopId: created.shopId,
            rating: created.rating,
            comment: created.comment,
            createdAt: created.createdAt,
          },
          ...current,
        ]);
        if (created.isNewStamp) {
          setStampToastVisible(true);
        }
      }
      setIsEditing(false);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not save your review."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteReview() {
    if (!myReview) return;
    setIsDeleting(true);
    try {
      await reviewService.remove(myReview.id);
      setReviews((current) => current.filter((r) => r.id !== myReview.id));
    } catch (err) {
      setError(getErrorMessage(err, "Could not delete your review."));
    } finally {
      setIsDeleting(false);
    }
  }

  const otherReviews = reviews.filter((r) => r.id !== myReview?.id);

  return (
    <div className="mx-4 mb-4 mt-3.5">
      {stampToastVisible && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-nosija-gold-700/90 px-4 py-2.5 text-sm font-semibold text-white">
          <Stamp size={18} />
          You earned a new passport stamp!
          <Link to="/profile/passport" className="ml-auto underline">
            View passport
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Reviews</p>
        {!isEditing && !myReview && (
          <button
            type="button"
            onClick={startWriting}
            className="text-xs font-semibold text-white underline"
          >
            Write a review
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2.5 rounded-2xl border border-white/55 bg-white/70 p-3.5 backdrop-blur-lg">
          <StarInput value={draftRating} onChange={setDraftRating} />
          <textarea
            value={draftComment}
            onChange={(e) => setDraftComment(e.target.value)}
            placeholder="Share what you thought..."
            rows={3}
            className="mt-2.5 w-full resize-none rounded-xl border border-border-default bg-surface-card px-3 py-2 text-sm text-text-primary outline-none focus:border-primary-700"
          />
          {formError && (
            <p className="mt-1.5 text-xs text-nosija-red-700">{formError}</p>
          )}
          <div className="mt-2.5 flex gap-2">
            <Button
              onClick={submitReview}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : myReview ? "Update review" : "Submit review"}
            </Button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              aria-label="Cancel"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-primary-800 text-primary-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : myReview ? (
        <div className="mt-2.5 rounded-2xl border border-white/55 bg-white/70 p-3.5 backdrop-blur-lg">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-text-secondary">Your review</p>
              <StarDisplay rating={myReview.rating} />
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={startWriting}
                aria-label="Edit your review"
                className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={deleteReview}
                disabled={isDeleting}
                aria-label="Delete your review"
                className="flex h-8 w-8 items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100 disabled:opacity-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <p className="mt-1.5 text-sm text-text-secondary">{myReview.comment}</p>
        </div>
      ) : null}

      <div className="mt-2.5 flex flex-col gap-2">
        {isLoading ? (
          <p className="text-xs text-white/80">Loading reviews...</p>
        ) : error ? (
          <p className="text-xs text-white/80">{error}</p>
        ) : otherReviews.length === 0 && !myReview ? (
          <p className="text-xs text-white/80">
            No reviews yet - be the first to share your experience.
          </p>
        ) : (
          otherReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/40 bg-white/50 p-3 backdrop-blur-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-text-primary">
                  {review.userName}
                </p>
                <StarDisplay rating={review.rating} />
              </div>
              <p className="mt-1 text-xs text-text-secondary">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
