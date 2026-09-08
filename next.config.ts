import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Alt hostnames that must 308 to the apex canonical host. The primary
// mechanism is Vercel's domain-level redirects (dashboard/API — see
// CLAUDE.md "Domain Redirects"); this app-level list is a safety net so a
// dashboard regression can never serve the full site on a duplicate host
// again. vercel.json redirects do NOT work on Next.js projects — this is
// the only redirect config that belongs in the repo.
const ALT_HOSTS = [
  "www.konectr.app",
  "konectrapp.com",
  "www.konectrapp.com",
  "konectr.my",
  "www.konectr.my",
  "konectrcircle.com",
  "www.konectrcircle.com",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...ALT_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://konectr.app/:path*",
        permanent: true,
      })),
      // 🔴 The root MUST redirect permanently. next-intl's middleware sends
      // "/" to the detected locale with a 307, and a 307 tells Google the
      // move is temporary — so Google kept "https://konectr.app/" as the
      // canonical and marked /en "Duplicate, Google chose different
      // canonical than user" (URL Inspection, 2026-09-08). Nothing on the
      // site could be indexed through the homepage. This rule runs before
      // middleware, so the 308 wins. Cost, accepted by the founder: the
      // root no longer content-negotiates — everyone lands on /en and
      // switches locale from the picker. Do not make this temporary.
      { source: "/", destination: "/en", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
