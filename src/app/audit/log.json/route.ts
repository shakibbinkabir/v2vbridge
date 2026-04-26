import {
  getAllEntrepreneurs,
  getAllPublishedPodcasts,
  getAllPublishedReels,
} from "@/lib/content";

export const dynamic = "force-static";

type AuditLogEntry =
  | {
      kind: "podcast";
      id: string;
      type: "Podcast";
      title: string;
      publishedAt: string | null;
    }
  | {
      kind: "entrepreneur";
      id: string;
      type: "Entrepreneur";
      title: string;
      publishedAt: string | null;
      reviewers: { ysc1: string; ysc2: string; projectLead: string };
      consentFormFilename: string;
    }
  | {
      kind: "reel";
      id: string;
      type: "Reel";
      title: string;
      publishedAt: string | null;
    };

export function GET(): Response {
  const entrepreneurs = getAllEntrepreneurs();
  const podcasts = getAllPublishedPodcasts();
  const reels = getAllPublishedReels();

  const entries: AuditLogEntry[] = [
    ...entrepreneurs.map((e) => ({
      kind: "entrepreneur" as const,
      id: e.id,
      type: "Entrepreneur" as const,
      title: e.displayName,
      publishedAt: e.publishedAt ?? null,
      reviewers: {
        ysc1: e.reviewers.ysc1,
        ysc2: e.reviewers.ysc2,
        projectLead: e.reviewers.projectLead,
      },
      consentFormFilename: e.consentFormFilename,
    })),
    ...podcasts.map((p) => ({
      kind: "podcast" as const,
      id: p.id,
      type: "Podcast" as const,
      title: p.title.en,
      publishedAt: p.publishedAt ?? null,
    })),
    ...reels.map((r) => ({
      kind: "reel" as const,
      id: r.id,
      type: "Reel" as const,
      title: r.caption.en,
      publishedAt: r.publishedAt ?? null,
    })),
  ];

  entries.sort((a, b) => a.id.localeCompare(b.id));

  const body = {
    generatedAt: new Date().toISOString(),
    counts: {
      total: entries.length,
      entrepreneurs: entrepreneurs.length,
      podcasts: podcasts.length,
      reels: reels.length,
      entrepreneursMissingConsent: entrepreneurs.filter(
        (e) => !e.consentFormFilename || e.consentFormFilename.trim() === "",
      ).length,
    },
    entries,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}
