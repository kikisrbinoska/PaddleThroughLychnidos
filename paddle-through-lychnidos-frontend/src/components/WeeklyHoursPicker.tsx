import { Plus, Trash2 } from "lucide-react";

// Mirrors PaddleThroughLychnidos.Domain.Shared.WeeklyHoursEntry, serialized
// as a flat JSON array (Shop.StructuredHoursJson / AddRequest.StructuredHoursJson).
// System.DayOfWeek: Sunday=0 .. Saturday=6.
export interface WeeklyHoursEntry {
  dayOfWeek: number;
  opensAt: string; // "HH:mm:ss" (TimeOnly)
  closesAt: string;
}

const DAYS: { value: number; label: string }[] = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

export interface WeeklyHoursPickerProps {
  entries: WeeklyHoursEntry[];
  onChange: (entries: WeeklyHoursEntry[]) => void;
}

// TimeOnly serializes as "HH:mm:ss" - <input type="time"> works in "HH:mm",
// so convert both directions at the edges of this component only.
function toInputTime(value: string): string {
  return value.slice(0, 5);
}
function toEntryTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

export function WeeklyHoursPicker({ entries, onChange }: WeeklyHoursPickerProps) {
  function windowsFor(day: number): WeeklyHoursEntry[] {
    return entries.filter((e) => e.dayOfWeek === day);
  }

  function addWindow(day: number) {
    onChange([...entries, { dayOfWeek: day, opensAt: "09:00:00", closesAt: "17:00:00" }]);
  }

  function removeWindow(day: number, index: number) {
    let seen = -1;
    onChange(
      entries.filter((e) => {
        if (e.dayOfWeek !== day) return true;
        seen += 1;
        return seen !== index;
      }),
    );
  }

  function updateWindow(day: number, index: number, field: "opensAt" | "closesAt", value: string) {
    let seen = -1;
    onChange(
      entries.map((e) => {
        if (e.dayOfWeek !== day) return e;
        seen += 1;
        if (seen !== index) return e;
        return { ...e, [field]: toEntryTime(value) };
      }),
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border-default bg-surface-card p-3">
      {DAYS.map((day) => {
        const dayWindows = windowsFor(day.value);
        const isClosed = dayWindows.length === 0;

        return (
          <div key={day.value} className="flex flex-col gap-1.5 border-b border-border-default pb-2 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary">{day.label}</span>
              <button
                type="button"
                onClick={() => addWindow(day.value)}
                aria-label={`Add hours for ${day.label}`}
                className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-primary-800 hover:bg-primary-100"
              >
                <Plus size={12} />
                {isClosed ? "Add hours" : "Add window"}
              </button>
            </div>

            {isClosed ? (
              <p className="text-xs text-text-secondary">Closed</p>
            ) : (
              dayWindows.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="time"
                    value={toInputTime(entry.opensAt)}
                    onChange={(e) => updateWindow(day.value, index, "opensAt", e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-white px-2 py-1.5 text-sm text-text-primary outline-none focus:border-primary-700"
                  />
                  <span className="text-xs text-text-secondary">to</span>
                  <input
                    type="time"
                    value={toInputTime(entry.closesAt)}
                    onChange={(e) => updateWindow(day.value, index, "closesAt", e.target.value)}
                    className="w-full rounded-lg border border-border-default bg-white px-2 py-1.5 text-sm text-text-primary outline-none focus:border-primary-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeWindow(day.value, index)}
                    aria-label="Remove this window"
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-nosija-red-700 hover:bg-nosija-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
