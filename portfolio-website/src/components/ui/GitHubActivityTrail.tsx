"use client";

import { useEffect, useState } from "react";

interface ActivityDay {
  date: string;
  count: number;
}

// forest-900 → forest-300: dimmest (no activity) to brightest (most active),
// deliberately this site's own green palette rather than GitHub's own scale.
const BUCKET_COLORS = ["#1d3d1d", "#224922", "#2d722d", "#5aaf5a", "#89cc89"];

function bucketFor(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((count / max) * 4)));
}

/** A small "trail" of intensity-graded dots showing recent GitHub activity.
 * Purely decorative — fetches `/api/github-activity` on mount and renders
 * nothing at all if that comes back empty (no token configured, or any
 * failure — the route itself never errors, it just returns `{ days: [] }`). */
export function GitHubActivityTrail() {
  const [days, setDays] = useState<ActivityDay[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/github-activity")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data.days) && data.days.length > 0) {
          setDays(data.days);
        }
      })
      .catch(() => {
        // decorative only — silently render nothing on failure
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!days) return null;

  const max = Math.max(...days.map((d) => d.count), 0);

  return (
    <div className="glass-nature rounded-2xl p-6 mb-24">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-forest-200/70">Recent activity</span>
        <a
          href="https://github.com/voidomin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-forest-300/70 hover:text-forest-200 transition-colors"
        >
          See full activity →
        </a>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => (
          <span
            key={day.date}
            title={`${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}`}
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: BUCKET_COLORS[bucketFor(day.count, max)] }}
          />
        ))}
      </div>
    </div>
  );
}
