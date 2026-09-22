import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TODO: self-host these once real image files are available — see README.
    // Photos currently referenced directly from the salon's old WordPress host.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6039-barclays.wpnet.stylenet.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
