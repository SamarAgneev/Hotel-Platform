"use client";

import { Input } from "@/components/ui/Input";

export interface DateRangeValue {
  checkInDate: string;
  checkOutDate: string;
}

export interface DateRangePickerProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  error?: string;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

/**
 * Native <input type="date"> rather than a custom calendar widget: it is
 * accessible and mobile-friendly by default (the OS supplies the picker
 * UI), which is what the brief asks for without the cost of building and
 * maintaining a bespoke calendar component in Step 2.
 */
export function DateRangePicker({ value, onChange, error }: DateRangePickerProps) {
  const min = todayISO();

  function handleCheckIn(checkInDate: string) {
    const nextCheckOut =
      value.checkOutDate && value.checkOutDate > checkInDate
        ? value.checkOutDate
        : addDaysISO(checkInDate, 1);
    onChange({ checkInDate, checkOutDate: nextCheckOut });
  }

  function handleCheckOut(checkOutDate: string) {
    onChange({ ...value, checkOutDate });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Input
        type="date"
        label="Check-in"
        min={min}
        value={value.checkInDate}
        onChange={(event) => handleCheckIn(event.target.value)}
        required
      />
      <Input
        type="date"
        label="Check-out"
        min={value.checkInDate ? addDaysISO(value.checkInDate, 1) : min}
        value={value.checkOutDate}
        onChange={(event) => handleCheckOut(event.target.value)}
        error={error}
        required
      />
    </div>
  );
}
