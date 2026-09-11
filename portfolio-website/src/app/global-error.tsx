"use client";

import { useEffect } from "react";

/* ──────────────────────────────────────────────────────────
   Root layout error boundary — Next.js only invokes this when
   an error escapes layout.tsx itself (LoadingScreen,
   StorybookCursor, SmoothScroll, CommandPalette all live there
   with no boundary of their own today). Must render its own
   <html>/<body> since it replaces the root layout when active,
   and is kept dependency-free since layout.tsx's own tree
   (fonts, Tailwind) may be exactly what's failing.
   ────────────────────────────────────────────────────────── */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
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
          The app hit an unexpected error while loading. Reloading usually fixes it.
        </p>
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
          Reload
        </button>
      </body>
    </html>
  );
}
