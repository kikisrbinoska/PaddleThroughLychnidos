// LocalFileUploadService (API) returns uploaded file URLs as paths relative
// to the API's own origin (e.g. "/uploads/shops/abc.jpg"), not the
// frontend's - the frontend is deployed separately (S3) from the API
// (EC2/nginx), so a bare relative path resolves against the wrong origin
// and 404s. VITE_API_BASE_URL includes a trailing "/api", which uploaded
// files are NOT served under, so that suffix is stripped here.
//
// Only rewrites "/uploads/..." specifically - other relative paths (e.g.
// "/category-backgrounds/..." under public/) are bundled with the frontend
// itself and must stay resolved against the frontend's own origin.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/api\/?$/, "");

export function resolveUploadUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (!url.startsWith("/uploads/")) return url;
  return `${API_ORIGIN}${url}`;
}
