import type { Region } from "../types";

export interface RegionChipProps {
  region: Region;
  onClick: (region: Region) => void;
}

export function RegionChip({ region, onClick }: RegionChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(region)}
      className="flex w-28 flex-none snap-start flex-col items-center gap-2 rounded-2xl border border-border-default bg-surface-card p-3 text-center shadow-sm md:w-full"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100 text-sm font-bold text-secondary-900">
        {region.name.charAt(0)}
      </div>
      <span className="line-clamp-2 text-xs font-semibold text-text-primary">
        {region.name}
      </span>
    </button>
  );
}
