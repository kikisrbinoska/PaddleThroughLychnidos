export type RegistrationRole = "RegularUser" | "Artisan";

export interface RoleSelectorProps {
  value: RegistrationRole;
  onChange: (role: RegistrationRole) => void;
}

const options: { value: RegistrationRole; label: string }[] = [
  { value: "RegularUser", label: "Tourist" },
  { value: "Artisan", label: "Artisan" },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Account type"
      className="grid grid-cols-2 gap-3"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
              isSelected
                ? "border-primary-900 bg-primary-900 text-white"
                : "border-border-default bg-surface-card text-text-primary hover:border-primary-500"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
