"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/* ──────────────────────────────────────────────────────────
   useSafeReducedMotion – framer-motion's own useReducedMotion()
   reads the real browser preference synchronously on the very
   first client render (no null/deferred placeholder), while the
   server always renders assuming false (no `window`). If a
   visitor's actual OS/browser preference is "reduce", that first
   client render can compute different inline styles than what
   the server sent — a real React hydration mismatch, reproduced
   via Playwright's reducedMotion:"reduce" context.

   This hook always returns false for the hydration-matching
   first render (both server and initial client paint), then
   updates to the real value in an effect once hydration is
   already done — a normal post-hydration re-render, not a
   mismatch. Use this instead of framer-motion's useReducedMotion
   directly anywhere the value affects rendered style/structure
   on first paint (not needed for effect-only usage, e.g. gating
   whether an animation loop starts).
   ────────────────────────────────────────────────────────── */
export function useSafeReducedMotion(): boolean {
  const raw = useReducedMotion();
  const [safe, setSafe] = useState(false);

  useEffect(() => {
    setSafe(Boolean(raw));
  }, [raw]);

  return safe;
}
