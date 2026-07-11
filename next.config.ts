import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent the app being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Don't sniff content types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send origin on cross-site requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for a year once visited over HTTPS
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Lock down powerful browser APIs we don't use
  { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
