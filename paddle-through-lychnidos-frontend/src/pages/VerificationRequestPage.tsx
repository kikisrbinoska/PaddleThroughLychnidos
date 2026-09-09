import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ChevronLeft, FileText, X } from "lucide-react";
import { artisanService } from "../services/artisanService";
import { getErrorMessage } from "../services/errorMessage";
import type { OwnedShop } from "../types";
import { Button } from "../components/Button";

export function VerificationRequestPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();

  const [shop, setShop] = useState<OwnedShop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!shopId) return;
    let cancelled = false;

    artisanService
      .getShop(Number(shopId))
      .then((currentShop) => {
        if (cancelled) return;

        const isEligible =
          currentShop.status === "Approved" &&
          !currentShop.isVerified &&
          !currentShop.hasPendingVerificationRequest;

        if (!isEligible) {
          navigate("/artisan/dashboard", { replace: true });
          return;
        }

        setShop(currentShop);
      })
      .catch(() => {
        if (!cancelled) navigate("/artisan/dashboard", { replace: true });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shopId, navigate]);

  function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    setFiles((current) => [...current, ...selected]);
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError("");

    if (!shop) return;
    if (!notes.trim()) {
      setFormError("Tell us a bit about your craft before submitting.");
      return;
    }
    if (files.length === 0) {
      setFormError("Upload at least one supporting photo or document.");
      return;
    }

    setIsSubmitting(true);
    try {
      await artisanService.submitVerification(shop.id, notes.trim(), files);
      setSubmitted(true);
      setTimeout(() => navigate("/artisan/dashboard"), 2000);
    } catch (err) {
      setFormError(getErrorMessage(err, "Could not submit your verification request."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh pb-24">
      <header className="flex items-center gap-3 px-6 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/70 bg-white/70 text-primary-900 backdrop-blur-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-extrabold text-primary-900">
          Request Verification
        </h1>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-sm flex-col gap-4 px-6">
        {isLoading ? (
          <p className="text-sm text-text-secondary">Loading...</p>
        ) : submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-secondary-200/50 bg-secondary-100/50 p-8 text-center backdrop-blur-lg">
            <BadgeCheck size={28} className="text-secondary-900" />
            <p className="text-sm font-bold text-secondary-900">
              Your verification request has been submitted.
            </p>
            <p className="text-xs text-secondary-900/80">
              We'll review it and let you know the outcome.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur-lg"
          >
            <p className="text-sm text-text-secondary">
              Tell us about your craft - how long has your family practiced
              this tradition? Do you have a physical workshop visitors can
              see?
            </p>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Share your story..."
              className="rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700"
            />

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">
                Supporting photos or documents
              </p>
              <div className="flex flex-col gap-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 rounded-xl border border-border-default bg-white/80 px-3 py-2"
                  >
                    <FileText size={16} className="flex-none text-text-secondary" />
                    <span className="min-w-0 flex-1 truncate text-xs text-text-primary">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      className="flex h-6 w-6 flex-none items-center justify-center text-text-secondary"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-default px-4 py-3 text-sm font-semibold text-primary-800">
                  Add files
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={addFiles}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {formError && (
              <p className="rounded-lg bg-nosija-red-100 px-3 py-2 text-sm text-nosija-red-900">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit for verification"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
