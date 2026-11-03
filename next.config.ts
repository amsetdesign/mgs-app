import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Base Supabase (données, connexion) et fichiers publics Cloudflare R2 (sons, pochettes, affiches)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;
const supabase = supabaseUrl ? ` ${supabaseUrl.origin}` : "";
const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE ? new URL(process.env.NEXT_PUBLIC_R2_PUBLIC_BASE) : null;
const r2 = r2Url ? ` ${r2Url.origin}` : "";
// Envoi direct des fichiers vers R2 (adresse signée par le serveur)
const r2Upload = process.env.R2_ACCOUNT_ID ? ` https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : "";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabase}${r2} https://i.ytimg.com`,
  `media-src 'self' blob:${r2}`,
  "font-src 'self'",
  `connect-src 'self'${supabase}${r2Upload}`,
  // Clips YouTube intégrés aux fiches artistes et articles
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  experimental: {
    // Affiches et visuels envoyés par les formulaires
    serverActions: { bodySizeLimit: "8mb" },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      ...(r2Url ? [{ protocol: "https" as const, hostname: r2Url.hostname }] : []),
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
    qualities: [75],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
