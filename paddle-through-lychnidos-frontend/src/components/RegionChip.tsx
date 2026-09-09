import type { Region } from "../types";

export interface RegionChipProps {
  region: Region;
  onClick: (region: Region) => void;
  // "default" (white chip, used everywhere) vs "gradient" (soft blue-green
  // gradient, used only on the Home page).
  variant?: "default" | "gradient";
  // Index within the region list - used to alternate the pin fill between
  // primary-500/secondary-500, the same two colors MapPage.tsx cycles
  // through for its region polygons, so Home's shortcuts read as the same
  // regions shown on the Map screen.
  index?: number;
}

const variantClasses: Record<NonNullable<RegionChipProps["variant"]>, string> = {
  default: "border-white/60 bg-white/55 backdrop-blur-xl",
  gradient: "border-primary-200 bg-gradient-to-br from-primary-100 to-secondary-100",
};

// Same two-color cycle as MapPage.tsx's REGION_FILL_COLORS (primary-500,
// secondary-500), expressed as Tailwind classes for the pin badge.
const PIN_FILL_CLASSES = ["bg-primary-500", "bg-secondary-500"];

export function RegionChip({
  region,
  onClick,
  variant = "default",
  index = 0,
}: RegionChipProps) {
  const pinFill = PIN_FILL_CLASSES[index % PIN_FILL_CLASSES.length];

  return (
    <button
      type="button"
      onClick={() => onClick(region)}
      className={`flex w-28 flex-none snap-start flex-col items-center gap-2 rounded-2xl border p-3 pt-4 text-center shadow-sm md:w-full ${variantClasses[variant]}`}
    >
      {/* Map-pin marker: rounded square badge with a triangular tail,
          echoing the polygon fill colors used on the Map screen. */}
      <div className="relative mb-1">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${pinFill}`}
        >
          {region.name.charAt(0)}
        </div>
        <div
          className={`absolute -bottom-[5px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 ${pinFill}`}
        />
      </div>
      <span className="line-clamp-2 text-xs font-semibold text-text-primary">
        {region.name}
      </span>
    </button>
  );
}
