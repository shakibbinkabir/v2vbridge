import type { MetadataRoute } from "next";

import {
  getAllEntrepreneurs,
  getAllPublishedPodcasts,
} from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2vbridge.capec.consulting"
).replace(/\/+$/, "");

const STATIC_ROUTES: { path: string; changeFrequency: ChangeFrequency }[] = [
  { path: "", changeFrequency: "weekly" },
  { path: "/about", changeFrequency: "monthly" },
  { path: "/safeguarding", changeFrequency: "monthly" },
  { path: "/withdraw", changeFrequency: "monthly" },
  { path: "/resources", changeFrequency: "monthly" },
  { path: "/podcasts", changeFrequency: "weekly" },
  { path: "/entrepreneurs", changeFrequency: "weekly" },
  { path: "/reels", changeFrequency: "weekly" },
];

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

function isoToDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: buildTime,
      changeFrequency,
    }),
  );

  const podcastEntries: MetadataRoute.Sitemap = getAllPublishedPodcasts().map(
    (p) => ({
      url: `${BASE_URL}/podcasts/${p.id}`,
      lastModified: isoToDate(p.publishedAt) ?? buildTime,
      changeFrequency: "monthly" as const,
    }),
  );

  const entrepreneurEntries: MetadataRoute.Sitemap = getAllEntrepreneurs().map(
    (e) => ({
      url: `${BASE_URL}/entrepreneurs/${e.id}`,
      lastModified: isoToDate(e.publishedAt) ?? buildTime,
      changeFrequency: "monthly" as const,
    }),
  );

  return [...staticEntries, ...podcastEntries, ...entrepreneurEntries];
}
