// Mirrors LocalFileUploadService's allowlist and 10 MB cap - checked here
// too so a rejected file gives an instant, specific message instead of a
// round trip that fails with a generic "Could not upload image."
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE_BYTES = 10_000_000;

export function validateImageFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return `"${file.name}" isn't a supported image type. Use JPG, PNG, or WEBP.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / 1_000_000).toFixed(1);
    return `"${file.name}" is ${sizeMb} MB, which is over the 10 MB limit.`;
  }
  return null;
}
