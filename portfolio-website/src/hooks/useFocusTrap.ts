"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ──────────────────────────────────────────────────────────
   useFocusTrap – while isOpen, keeps Tab/Shift+Tab cycling
   within containerRef's focusable elements, and restores
   focus to whatever was focused before the dialog opened once
   it closes. None of the app's three role="dialog" overlays
   (Command Palette, both photography lightboxes) did either
   of these before — a keyboard user could Tab straight through
   into the page behind the backdrop, and closing never gave
   focus back to the control that opened it.

   Also moves focus into the dialog on open (the container itself,
   which needs tabIndex={-1} to be programmatically focusable) —
   without this, focus stays on whatever triggered the dialog
   (e.g. the gallery thumbnail just clicked), which sits outside
   containerRef, so the boundary checks below never match and Tab
   just walks the page behind the dialog untouched. Confirmed via
   real Playwright keyboard-navigation testing, not assumption —
   Command Palette's own pre-existing input.focus() on open masked
   this same gap there, so it only showed up on the two lightboxes.
   ────────────────────────────────────────────────────────── */
export function useFocusTrap(isOpen: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusId = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (container && !container.contains(document.activeElement)) {
        container.focus();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = containerRef.current;
      if (!container) return;

      const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusId);
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, containerRef]);
}
