"use client";

import { useEffect } from "react";

/* ──────────────────────────────────────────────────────────
   Route-segment error boundary — catches anything inside
   page.tsx that isn't already caught by one of its per-section
   SectionErrorBoundarys (the <main> shell itself, future
   additions). Kept dependency-free (inline styles only) since
   it's the last line of defense before global-error.tsx.
   ────────────────────────────────────────────────────────── */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#0f0d2e",
        color: "#e2e8f0",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Something went wrong.</h1>
      <p style={{ opacity: 0.7, maxWidth: "32rem", margin: 0 }}>
        This page hit an unexpected error. Try again, or head back to the homepage.
      </p>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={reset}
          style={{
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            background: "#3a8f3a",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "inherit",
            textDecoration: "none",
            fontSize: "0.875rem",
          }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}
