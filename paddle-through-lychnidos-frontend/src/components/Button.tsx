import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-900 to-secondary-900 text-white shadow-md shadow-primary-900/20 hover:brightness-105",
  // Secondary parallels primary's gradient treatment but stays green-leaning
  // (no blue stop) so the two remain visually distinct - secondary is used
  // for confirm/success-adjacent actions that shouldn't compete with the
  // primary brand gradient.
  secondary:
    "bg-gradient-to-r from-secondary-700 to-secondary-900 text-white shadow-md shadow-secondary-900/20 hover:brightness-105",
  outline:
    "bg-white/55 backdrop-blur-xl border border-white/60 text-primary-900 shadow-sm hover:bg-white/70",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
