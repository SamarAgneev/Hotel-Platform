"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

export interface GuestCounts {
  adults: number;
  children: number;
  rooms: number;
}

export interface GuestSelectorProps {
  value: GuestCounts;
  onChange: (value: GuestCounts) => void;
}

const LIMITS = {
  adults: { min: 1, max: 12 },
  children: { min: 0, max: 8 },
  rooms: { min: 1, max: 5 },
} as const;

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-primary">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-text-primary disabled:opacity-40"
        >
          −
        </button>
        <span className="w-5 text-center text-sm tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default text-text-primary disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function GuestSelector({ value, onChange }: GuestSelectorProps) {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryId = useId();

  const summaryLabel = `${value.adults} Adult${value.adults !== 1 ? "s" : ""}${
    value.children > 0 ? ` · ${value.children} Child${value.children !== 1 ? "ren" : ""}` : ""
  } · ${value.rooms} Room${value.rooms !== 1 ? "s" : ""}`;

  return (
    <details
      ref={detailsRef}
      open={open}
      onToggle={(event) => setOpen((event.target as HTMLDetailsElement).open)}
      className="relative"
    >
      <summary
        id={summaryId}
        className="flex h-11 cursor-pointer list-none items-center rounded-md border border-border-default bg-surface-raised px-3 text-sm text-text-primary [&::-webkit-details-marker]:hidden"
      >
        {summaryLabel}
      </summary>
      {open && (
        <div className="absolute z-20 mt-2 w-64 rounded-md border border-border-default bg-surface-raised p-4 shadow-md">
          <Counter
            label="Adults"
            value={value.adults}
            min={LIMITS.adults.min}
            max={LIMITS.adults.max}
            onChange={(adults) => onChange({ ...value, adults })}
          />
          <Counter
            label="Children"
            value={value.children}
            min={LIMITS.children.min}
            max={LIMITS.children.max}
            onChange={(children) => onChange({ ...value, children })}
          />
          <Counter
            label="Rooms"
            value={value.rooms}
            min={LIMITS.rooms.min}
            max={LIMITS.rooms.max}
            onChange={(rooms) => onChange({ ...value, rooms })}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="mt-3 w-full"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      )}
    </details>
  );
}
