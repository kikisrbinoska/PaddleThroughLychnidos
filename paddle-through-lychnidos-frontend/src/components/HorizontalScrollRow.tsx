import type { ReactNode } from "react";

export interface HorizontalScrollRowProps {
  children: ReactNode;
  className?: string;
}

// Scrolls horizontally with snap points on mobile; wraps into a grid on
// desktop (md:) so the same markup works for both layouts.
export function HorizontalScrollRow({
  children,
  className = "",
}: HorizontalScrollRowProps) {
  return (
    <div
      className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:grid md:snap-none md:grid-cols-3 md:overflow-visible lg:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}
