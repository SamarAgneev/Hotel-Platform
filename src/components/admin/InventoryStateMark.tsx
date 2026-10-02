import type { CalendarCellState } from "@/domain/availability/types";
import { cn } from "@/lib/utils/cn";

/**
 * Status is always conveyed by a letter AND a word (colour is only
 * reinforcement), so it reads in greyscale and for colour-blind staff.
 */
export const STATE_META: Record<CalendarCellState, { letter: string; label: string; cell: string; chip: string }> = {
  AVAILABLE: { letter: "A", label: "Available", cell: "bg-surface-raised text-text-secondary", chip: "bg-surface-sunken text-text-secondary" },
  BOOKED: { letter: "B", label: "Booked", cell: "bg-[#dfeaeb] text-accent-ops font-semibold", chip: "bg-[#dfeaeb] text-accent-ops" },
  BLOCKED: { letter: "M", label: "Blocked / maintenance", cell: "bg-[#f7ecd9] text-state-warning font-semibold", chip: "bg-[#f7ecd9] text-state-warning" },
  OUT_OF_SERVICE: { letter: "X", label: "Out of service", cell: "bg-[#f7e3de] text-state-danger font-semibold", chip: "bg-[#f7e3de] text-state-danger" },
};

export function StateChip({ state }: { state: CalendarCellState }) {
  const meta = STATE_META[state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", meta.chip)}>
      <span aria-hidden="true" className="font-semibold">{meta.letter}</span>
      {meta.label}
    </span>
  );
}

export function StateLegend() {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-text-secondary" aria-label="Legend">
      {(Object.keys(STATE_META) as CalendarCellState[]).map((state) => (
        <li key={state} className="flex items-center gap-2">
          <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded border border-border-default text-xs", STATE_META[state].cell)} aria-hidden="true">
            {STATE_META[state].letter}
          </span>
          {STATE_META[state].label}
        </li>
      ))}
    </ul>
  );
}
