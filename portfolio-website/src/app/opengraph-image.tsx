import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Akash — Full-Stack & Data Science Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #0d1f0d 0%, #1a3a1a 40%, #0f2d1a 70%, #0a1a0a 100%)",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow circles */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240,180,41,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          left: "-80px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Top: name + tag */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#f0b429",
            }}
          />
          <span
            style={{
              color: "#f0b429",
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Portfolio
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ color: "#fafaf9", fontSize: "72px", fontWeight: "700", lineHeight: 1 }}>
            Akash
          </span>
          <span style={{ color: "#a8a29e", fontSize: "24px", fontWeight: "400", lineHeight: 1.3 }}>
            Full-Stack & Data Science Engineer
          </span>
        </div>
      </div>

      {/* Bottom: location + skill tags */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          {["React", "Next.js", "Python", "Data Science"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "999px",
                color: "#d4d4d4",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color: "#78716c", fontSize: "14px" }}>📍</span>
          <span style={{ color: "#78716c", fontSize: "14px" }}>Bangalore, India</span>
        </div>
      </div>
    </div>,
    { ...size }
  );
}
