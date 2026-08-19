import type { InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, className = "", ...rest }: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
      <input
        id={id}
        className={`rounded-xl border border-border-default bg-surface-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary-700 ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-nosija-red-700">{error}</p>}
    </div>
  );
}
