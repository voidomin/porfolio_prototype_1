import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        background: "linear-gradient(180deg, #fef7e0 0%, #f0b429 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Mountain back */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <path
          d="M0 32 L0 22 Q4 14 8 18 Q12 8 16 14 Q20 6 24 12 Q28 9 32 16 L32 32 Z"
          fill="rgba(13,32,13,0.35)"
        />
        <path
          d="M0 32 L0 25 Q5 19 9 22 Q13 16 16 20 Q20 14 24 18 Q28 15 32 21 L32 32 Z"
          fill="rgba(13,32,13,0.7)"
        />
        <path d="M0 32 L0 28 Q8 24 16 27 Q24 23 32 27 L32 32 Z" fill="rgba(13,32,13,0.95)" />
        {/* Sun */}
        <circle cx="16" cy="12" r="4" fill="#fffde7" />
        <circle cx="16" cy="12" r="2.5" fill="#ffffff" />
      </svg>
    </div>,
    { ...size }
  );
}
