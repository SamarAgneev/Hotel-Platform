"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/contact";
import { submitContactEnquiry } from "@/lib/integrations/contact";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type SubmitState = "idle" | "submitting" | "success" | "server_error";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  async function onSubmit(data: ContactFormInput) {
    setSubmitState("submitting");
    setServerMessage(null);
    try {
      await submitContactEnquiry(data);
      // Unreachable until a real backend is connected — see
      // lib/integrations/contact.ts — kept so the success path is ready.
      setSubmitState("success");
      reset();
    } catch (error) {
      setSubmitState("server_error");
      setServerMessage(
        error instanceof Error ? error.message : "Something went wrong sending your message.",
      );
    }
  }

  if (submitState === "success") {
    return (
      <div role="status" className="rounded-lg border border-border-subtle bg-surface-raised p-6">
        <h3 className="text-lg text-text-primary">Message sent</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Thanks for reaching out — we&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Full name"
        required
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label="Email"
        type="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Input label="Phone (optional)" type="tel" error={errors.phone?.message} {...register("phone")} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-text-primary">
          Message <span aria-hidden="true" className="text-state-danger">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          required
          aria-invalid={!!errors.message || undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="rounded-md border border-border-default bg-surface-raised px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          placeholder="Tell us about your stay, dates, or any questions."
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="text-xs text-state-danger">
            {errors.message.message}
          </p>
        )}
      </div>

      {submitState === "server_error" && serverMessage && (
        <p role="alert" className="rounded-md bg-[#f7e3de] px-3 py-2 text-sm text-state-danger">
          {serverMessage}
        </p>
      )}

      <Button type="submit" isLoading={isSubmitting || submitState === "submitting"} className="w-fit">
        Send message
      </Button>
    </form>
  );
}
