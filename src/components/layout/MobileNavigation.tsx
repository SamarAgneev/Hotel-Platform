"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/domain/hotel/types";

export function MobileNavigation({ navItems }: { navItems: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else {
      toggleButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label="Open menu"
        className="flex h-10 w-10 items-center justify-center rounded-md text-text-primary hover:bg-surface-sunken"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-2">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="relative ml-auto flex h-full w-full max-w-xs flex-col gap-1 bg-surface-raised p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg text-text-primary">Menu</span>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-text-primary hover:bg-surface-sunken"
              >
                ✕
              </button>
            </div>
            <nav aria-label="Primary" className="mt-6 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-base text-text-primary hover:bg-surface-sunken"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/availability"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-md bg-accent-primary text-sm font-medium text-text-on-accent hover:bg-accent-primary-hover"
            >
              Check availability
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
