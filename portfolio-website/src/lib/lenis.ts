import type Lenis from "@studio-freight/lenis";

/* ──────────────────────────────────────────────────────────
   Single shared Lenis instance, set once from SmoothScroll.tsx
   on mount (or left null under prefers-reduced-motion / before
   mount). Every imperative "scroll to X" call site in the app
   goes through the scrollTo() helper below instead of calling
   window.scrollTo/scrollIntoView or a Lenis instance directly —
   keeps Lenis's internal target-scroll state from ever going
   stale, and falls back to native scrolling gracefully when
   Lenis isn't active.
   ────────────────────────────────────────────────────────── */

let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenisInstance() {
  return instance;
}

type ScrollToOptions = Parameters<Lenis["scrollTo"]>[1];

export function scrollTo(target: number | string | HTMLElement, options?: ScrollToOptions) {
  if (instance) {
    instance.scrollTo(target, options);
    return;
  }

  // No Lenis instance (not mounted yet, or prefers-reduced-motion skipped
  // creating one) — fall back to native scrolling.
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }

  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
}
