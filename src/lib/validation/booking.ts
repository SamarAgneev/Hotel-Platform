import { z } from "zod";

/**
 * Shared validation source of truth. The same schema drives client-side
 * React Hook Form validation and server-side re-validation — never trust
 * the client copy alone.
 */

export const availabilitySearchSchema = z
  .object({
    checkInDate: z.string().date("Choose a check-in date."),
    checkOutDate: z.string().date("Choose a check-out date."),
    adults: z.number().int().min(1).max(12).default(2),
    children: z.number().int().min(0).max(8).default(0),
    rooms: z.number().int().min(1).max(5).default(1),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out must be after check-in.",
    path: ["checkOutDate"],
  });

export type AvailabilitySearchInput = z.infer<typeof availabilitySearchSchema>;

export const guestDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required.").max(80),
  lastName: z.string().min(1, "Last name is required.").max(80),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number.").max(20).optional(),
});

export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;
