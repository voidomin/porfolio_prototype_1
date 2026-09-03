import type { MetadataRoute } from "next";
import { personalProfile } from "@/data/portfolio";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${personalProfile.name} — Portfolio`,
    short_name: personalProfile.name,
    description: personalProfile.headline,
    start_url: "/",
    display: "standalone",
    background_color: "#fef7e0",
    theme_color: "#f0b429",
    icons: [
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
