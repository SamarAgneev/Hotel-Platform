"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createRoomBlock } from "@/domain/availability/actions";
import { ROOM_BLOCK_REASONS, roomBlockSchema, type RoomBlockInput } from "@/lib/validation/inventory";

type Phase =
  | { name: "editing" }
  | { name: "confirming"; values: RoomBlockInput }
  | { name: "saving"; values: RoomBlockInput }
  | { name: "success"; blockId: string }
  | { name: "error"; values: RoomBlockInput; message: string };

export function RoomBlockForm({ roomOptions }: { roomOptions: { value: string; label: string }[] }) {
  const [phase, setPhase] = useState<Phase>({ name: "editing" });
  const today = new Date().toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RoomBlockInput>({ resolver: zodResolver(roomBlockSchema), defaultValues: { roomId: "", reason: undefined } });

  async function save(values: RoomBlockInput) {
    setPhase({ name: "saving", values });
    const result = await createRoomBlock(values);
    if (result.ok) {
      setPhase({ name: "success", blockId: result.blockId });
      reset();
      return;
    }
    if (result.code === "VALIDATION" && result.fieldErrors) {
      // Server is authoritative: surface its field errors back on the form.
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof RoomBlockInput, { message });
      }
      setPhase({ name: "editing" });
      return;
    }
    setPhase({ name: "error", values, message: result.message });
  }

  if (phase.name === "success") {
    return (
      <div role="status" className="rounded-lg border border-border-subtle bg-surface-raised p-6">
        <h2 className="text-lg text-text-primary">Room blocked</h2>
        <p className="mt-1 text-sm text-text-secondary">The room is now removed from sale for those dates.</p>
        <Button className="mt-4" variant="secondary" onClick={() => setPhase({ name: "editing" })}>Block another room</Button>
      </div>
    );
  }

  if (phase.name === "confirming" || phase.name === "saving" || phase.name === "error") {
    const v = phase.values;
    const roomLabel = roomOptions.find((o) => o.value === v.roomId)?.label ?? v.roomId;
    const saving = phase.name === "saving";
    return (
      <div className="rounded-lg border border-border-subtle bg-surface-raised p-6" role="group" aria-labelledby="confirm-title">
        <h2 id="confirm-title" className="text-lg text-text-primary">Confirm room block</h2>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-text-secondary">Room</dt><dd>{roomLabel}</dd>
          <dt className="text-text-secondary">From</dt><dd>{v.startDate}</dd>
          <dt className="text-text-secondary">Until</dt><dd>{v.endDate} <span className="text-text-secondary">(room is free again on this date)</span></dd>
          <dt className="text-text-secondary">Reason</dt><dd>{v.reason}</dd>
          {v.notes && (<><dt className="text-text-secondary">Notes</dt><dd>{v.notes}</dd></>)}
        </dl>
        <p className="mt-3 text-sm text-text-secondary">Guests won&apos;t be able to book this room for these dates.</p>
        {phase.name === "error" && (
          <p role="alert" className="mt-3 rounded-md bg-[#f7e3de] px-3 py-2 text-sm text-state-danger">{phase.message}</p>
        )}
        <div className="mt-4 flex gap-2">
          <Button isLoading={saving} onClick={() => save(v)} variant="ops">{phase.name === "error" ? "Try again" : "Confirm block"}</Button>
          <Button variant="ghost" disabled={saving} onClick={() => setPhase({ name: "editing" })}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit((values) => setPhase({ name: "confirming", values }))} noValidate className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-raised p-6">
      <h2 className="text-lg text-text-primary">Block a room</h2>
      <Select label="Room" required error={errors.roomId?.message} options={[{ value: "", label: "Choose a room…" }, ...roomOptions]} {...register("roomId")} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="From" type="date" required min={today} error={errors.startDate?.message} {...register("startDate")} />
        <Input label="Until" type="date" required min={today} hint="The room is free again on this date." error={errors.endDate?.message} {...register("endDate")} />
      </div>
      <Select label="Reason" required error={errors.reason?.message} options={[{ value: "", label: "Choose a reason…" }, ...ROOM_BLOCK_REASONS.map((r) => ({ value: r, label: r }))]} {...register("reason")} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="block-notes" className="text-sm font-medium text-text-primary">Notes (optional)</label>
        <textarea id="block-notes" rows={3} aria-invalid={!!errors.notes || undefined} className="rounded-md border border-border-default bg-surface-raised px-3 py-2 text-sm" {...register("notes")} />
        {errors.notes && <p role="alert" className="text-xs text-state-danger">{errors.notes.message}</p>}
      </div>
      <Button type="submit" variant="ops" className="w-fit">Review block</Button>
    </form>
  );
}
