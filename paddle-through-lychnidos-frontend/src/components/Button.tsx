import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-800 text-white hover:bg-primary-900",
  secondary: "bg-secondary-700 text-white hover:bg-secondary-800",
  outline:
    "bg-transparent text-primary-800 border border-primary-800 hover:bg-primary-100",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
