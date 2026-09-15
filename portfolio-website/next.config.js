/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    // Next 16 defaults images.qualities to [75] only; this app's call sites
    // deliberately use 85/90 for photography/project imagery, so those
    // values must be explicitly allow-listed.
    qualities: [75, 85, 90],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

module.exports = nextConfig;
