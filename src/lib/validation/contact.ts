import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(1, "Enter your name.").max(120),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().max(20).optional(),
  message: z.string().min(10, "Tell us a little more (at least 10 characters).").max(2000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
