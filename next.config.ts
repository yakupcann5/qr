import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,

  // Upload source maps for better stack traces
  widenClientFileUpload: true,

  // Source map config
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
});
