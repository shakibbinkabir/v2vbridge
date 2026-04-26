import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2vbridge.capec.consulting"
).replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/audit",
          "/audit/",
          "/dev",
          "/dev/",
          "/_dev",
          "/_dev/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
