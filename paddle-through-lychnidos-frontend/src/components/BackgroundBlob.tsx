export interface BackgroundBlobProps {
  // Tailwind position classes, e.g. "-top-20 -left-20".
  position: string;
  // Tailwind size classes, e.g. "h-72 w-72".
  size?: string;
  tint?: "primary" | "secondary";
}

const tintClasses: Record<NonNullable<BackgroundBlobProps["tint"]>, string> = {
  primary: "bg-primary-400/20",
  secondary: "bg-secondary-400/20",
};

// Large, softly blurred decorative color blob used to add ambient depth
// behind hero content. Intentionally used sparingly (Splash, Onboarding,
// Login/Register, Home only) per the design spec - not a general-purpose
// page background element. Always render it before interactive content in
// the DOM (or give it -z-10) and keep aria-hidden since it's purely
// decorative.
export function BackgroundBlob({
  position,
  size = "h-72 w-72",
  tint = "primary",
}: BackgroundBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${size} ${position} ${tintClasses[tint]}`}
    />
  );
}
