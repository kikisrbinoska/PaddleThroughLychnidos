import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant =
  | "primary"
  | "secondary"
  | "brown"
  | "nosijaRed"
  | "nosijaGold";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-900",
  secondary: "bg-secondary-100 text-secondary-900",
  brown: "bg-brown-100 text-brown-900",
  nosijaRed: "bg-nosija-red-100 text-nosija-red-900",
  nosijaGold: "bg-nosija-gold-100 text-nosija-gold-900",
};

export function Badge({
  variant = "primary",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
