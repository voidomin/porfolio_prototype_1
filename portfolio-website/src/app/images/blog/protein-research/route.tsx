import { ImageResponse } from "next/og";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0d1f16 0%, #1c3b26 55%, #2f5233 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Faint scattered "atom" dots */}
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {[
          [120, 90],
          [980, 70],
          [1080, 480],
          [90, 520],
          [620, 60],
          [220, 430],
          [860, 180],
          [1120, 260],
          [60, 260],
          [520, 560],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3} fill="rgba(230,245,220,0.35)" />
        ))}

        {/* Stylized protein ribbon: overlapping helix + sheet arrows */}
        <g transform="translate(300, 140)">
          <path
            d="M0 80 C 60 0, 140 0, 200 80 S 340 160, 400 80 S 540 0, 600 80"
            stroke="#f0b429"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M0 160 C 60 240, 140 240, 200 160 S 340 80, 400 160 S 540 240, 600 160"
            stroke="#9bcf3a"
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          <path
            d="M0 240 C 60 200, 140 200, 200 240 S 340 280, 400 240 S 540 200, 600 240"
            stroke="#fef7e0"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.5"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 64,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(240,180,41,0.85)",
            fontFamily: "sans-serif",
          }}
        >
          Research Notes
        </span>
        <span
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#fef7e0",
            fontFamily: "sans-serif",
          }}
        >
          CcdB, Rosetta, and a hundred mutations
        </span>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT }
  );
}
