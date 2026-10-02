import { z } from "zod";

export const ROOM_BLOCK_REASONS = ["Maintenance", "Deep clean", "Owner hold", "Renovation", "Other"] as const;

/**
 * Room block input. Used by the admin form (UX) AND re-run inside the
 * server action (authority). Dates are ISO calendar dates; the block
 * occupies [startDate, endDate) like a stay, so endDate must be after
 * startDate.
 */
export const roomBlockSchema = z
  .object({
    roomId: z.string().min(1, "Choose a room."),
    startDate: z.string().date("Choose a start date."),
    endDate: z.string().date("Choose an end date."),
    reason: z.enum(ROOM_BLOCK_REASONS, { message: "Choose a reason." }),
    notes: z.string().max(500, "Keep notes under 500 characters.").optional(),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "End date must be after the start date.",
    path: ["endDate"],
  });

export type RoomBlockInput = z.infer<typeof roomBlockSchema>;
