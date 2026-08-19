import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border-default bg-surface-card p-4 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
