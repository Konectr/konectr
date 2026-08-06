// © Konectr 2026. All rights reserved.
// Proprietary and confidential.

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://konectr.app/sitemap.xml",
  };
}
