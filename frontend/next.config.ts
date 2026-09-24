import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // Strapi already serves appropriately-sized JPEGs; letting the browser fetch
    // them directly (instead of Next re-encoding every size/format on the server
    // on each request) avoids overloading the container when many images load at
    // once, and sidesteps proxying media through the app server entirely.
    unoptimized: true,
  },
};

export default nextConfig;
