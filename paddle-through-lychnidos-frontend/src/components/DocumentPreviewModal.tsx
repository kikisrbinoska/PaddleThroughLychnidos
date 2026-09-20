import { Download, X } from "lucide-react";

export interface DocumentPreviewModalProps {
  url: string;
  onClose: () => void;
}

function isPdf(url: string): boolean {
  return url.toLowerCase().endsWith(".pdf");
}

// Verification uploads are only ever an image (.jpg/.jpeg/.png/.webp) or a
// .pdf - see LocalFileUploadService's allowed-extension list - so branching
// on the extension is enough to pick the right preview, no content-type
// metadata needed.
export function DocumentPreviewModal({ url, onClose }: DocumentPreviewModalProps) {
  const fileName = url.split("/").pop() ?? "document";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-default px-5 py-3">
          <p className="truncate text-sm font-bold text-text-primary">{fileName}</p>
          <div className="flex flex-none items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in new tab to download or print"
              className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
            >
              <Download size={16} />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary hover:bg-primary-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-surface-bg p-2">
          {isPdf(url) ? (
            <iframe
              src={url}
              title={fileName}
              className="h-[75vh] w-full rounded-lg border border-border-default bg-white"
            />
          ) : (
            <img
              src={url}
              alt={fileName}
              className="mx-auto max-h-[75vh] w-auto rounded-lg object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
