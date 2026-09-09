import type { HTMLAttributes, ReactNode } from "react";

export type CardVariant =
  | "default"
  | "light"
  | "strong"
  | "tintedPrimary"
  | "tintedSecondary";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  // "default" (original flat white card, unchanged - kept as the fallback so
  // every existing call site that doesn't pass a variant renders exactly as
  // before). "light" = general-purpose glass card for tourist-facing content
  // over the ambient gradient bg. "strong" = higher-opacity/more readable
  // glass, for admin/artisan data-dense screens and long text blocks.
  // "tintedPrimary"/"tintedSecondary" = accent-tinted glass for
  // verified/premium/success moments.
  variant?: CardVariant;
}

const variantClasses: Record<CardVariant, string> = {
  default: "border border-border-default bg-surface-card shadow-sm",
  light:
    "bg-white/55 backdrop-blur-xl border border-white/60 shadow-lg shadow-primary-900/5",
  strong: "bg-white/70 backdrop-blur-lg border border-white/70 shadow-sm",
  tintedPrimary:
    "bg-primary-100/50 backdrop-blur-lg border border-primary-200/50 shadow-sm",
  tintedSecondary:
    "bg-secondary-100/50 backdrop-blur-lg border border-secondary-200/50 shadow-sm",
};

export function Card({
  className = "",
  variant = "default",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-2xl p-4 ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

// Glass-style card for tourist-facing content over the ambient gradient bg -
// alias over the "light" variant so call sites can reach for it by name.
export function GlassCard({
  className = "",
  children,
  ...rest
}: Omit<CardProps, "variant">) {
  return (
    <Card variant="light" className={className} {...rest}>
      {children}
    </Card>
  );
}
