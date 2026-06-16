import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Trail Not Found | Akash",
  description: "This path doesn't exist. Head back to the trailhead.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{
        background:
          "linear-gradient(180deg, #fef7e0 0%, #fdedb7 30%, #fbdf85 60%, #f0b429 100%)",
      }}
    >
      {/* Mountain silhouettes */}
      <svg
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        style={{ height: "200px" }}
      >
        <path
          d="M0,300 L0,200 Q240,80 480,160 Q720,40 960,120 Q1200,60 1440,160 L1440,300 Z"
          fill="rgba(13,32,13,0.4)"
        />
        <path
          d="M0,300 L0,240 Q180,160 360,210 Q540,130 720,190 Q900,110 1080,175 Q1260,130 1440,200 L1440,300 Z"
          fill="rgba(13,32,13,0.75)"
        />
        <path
          d="M0,300 L0,268 Q360,220 720,258 Q1080,215 1440,265 L1440,300 Z"
          fill="rgba(13,32,13,0.95)"
        />
      </svg>

      {/* Sun glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 180,
          height: 180,
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(255,253,231,0.9) 0%, rgba(240,180,41,0.5) 50%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        <p className="text-forest-800/50 text-xs tracking-[0.35em] uppercase font-semibold mb-4">
          Lost on the trail
        </p>

        <h1
          className="text-8xl sm:text-9xl font-bold text-forest-950 leading-none mb-4"
          style={{ textShadow: "0 2px 20px rgba(255,255,255,0.4)" }}
        >
          404
        </h1>

        <p className="text-xl font-medium text-forest-900/80 mb-3">
          This path doesn&apos;t exist
        </p>
        <p className="text-forest-900/50 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
          The trail you were following has faded. Head back to the trailhead
          and find your way.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-forest-800 text-white font-semibold rounded-full hover:bg-forest-700 transition-colors duration-300 shadow-lg shadow-forest-900/20"
        >
          ← Back to trailhead
        </Link>
      </div>
    </div>
  );
}
