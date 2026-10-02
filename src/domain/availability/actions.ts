"use server";

import { requireRole } from "@/lib/auth/session";
import { emitEvent } from "@/lib/events/bus";
import { AUTOMATION_EVENTS } from "@/lib/events/types";
import { roomBlockSchema } from "@/lib/validation/inventory";

export type CreateRoomBlockResult =
  | { ok: true; blockId: string }
  | { ok: false; code: "VALIDATION" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" | "OVERLAP" | "SERVER"; message: string; fieldErrors?: Record<string, string> };

/**
 * Create a room block. Server-authoritative, in this order:
 *  1. validate input (never trust the browser's dates/ids),
 *  2. authenticate + authorize (staff, at least FRONT_DESK),
 *  3. verify the room belongs to the staff member's property/hotel,
 *  4. refuse blocks that would collide with held bookings,
 *  5. persist, audit, emit `room_blocked`.
 *
 * In this build step 2 fails for everyone: Step 1's session boundary has no
 * identity provider yet, so `requireRole` throws UNAUTHENTICATED. That is
 * the intended, honest behaviour — the mutation is not publicly callable —
 * and steps 3-5 are the documented contract to implement with the database.
 */
export async function createRoomBlock(input: unknown): Promise<CreateRoomBlockResult> {
  const parsed = roomBlockSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, code: "VALIDATION", message: "Check the highlighted fields.", fieldErrors };
  }

  try {
    const session = await requireRole("FRONT_DESK");

    // TODO(database): const room = await prisma.room.findFirst({ where: { id: parsed.data.roomId, property: { hotelId: session.hotelId } } });
    //   if (!room) return NOT_FOUND;  // ownership check — roomId from the browser is untrusted
    // TODO(database): reject if an overlapping held booking exists (see engine.isRoomAvailable on a fresh read).
    // TODO(database): create RoomBlock (createdByStaffId: session.staffId) + AuditLog row in one transaction.
    void session;

    const blockId = "pending-database";
    await emitEvent(AUTOMATION_EVENTS.ROOM_BLOCKED, {
      roomId: parsed.data.roomId,
      blockId,
      reason: parsed.data.reason,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
    });
    return { ok: true, blockId };
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (code === "UNAUTHENTICATED") {
      return { ok: false, code, message: "You need to be signed in as hotel staff to block a room." };
    }
    if (code === "FORBIDDEN") {
      return { ok: false, code, message: "Your role doesn't allow blocking rooms." };
    }
    return { ok: false, code: "SERVER", message: "The block couldn't be saved. Please try again." };
  }
}
