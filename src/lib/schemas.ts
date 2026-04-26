import { z } from "zod";

import type {
  Entrepreneur,
  PageCopy,
  PodcastEpisode,
  Reel,
  SiteCopy,
} from "./types";

export const bilingualStringSchema = z.object({
  en: z.string().min(1),
  bn: z.string().min(1),
});

export const entrepreneurSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  sector: z.string().min(1),
  district: z.string().min(1),
  photo: z.string().optional(),
  photoConsent: z.boolean(),
  summary: bilingualStringSchema,
  podcastId: z.string().optional(),
  reelIds: z.array(z.string()),
  consentFormFilename: z.string().min(1),
  publishedAt: z.iso.date().optional(),
  published: z.boolean(),
  reviewers: z.object({
    ysc1: z.string().min(1),
    ysc2: z.string().min(1),
    projectLead: z.string().min(1),
  }),
}) satisfies z.ZodType<Entrepreneur>;

export const podcastEpisodeSchema = z.object({
  id: z.string().min(1),
  episodeNumber: z.number().int().positive(),
  title: bilingualStringSchema,
  summary: bilingualStringSchema,
  embed: z.object({
    provider: z.enum(["spotify", "anchor", "youtube"]),
    embedId: z.string().min(1),
  }),
  durationSeconds: z.number().int().nonnegative(),
  recordedOn: z.iso.date(),
  publishedAt: z.iso.date().optional(),
  published: z.boolean(),
  entrepreneurId: z.string().min(1),
  transcriptUrl: z.string().url().optional(),
}) satisfies z.ZodType<PodcastEpisode>;

export const reelSchema = z.object({
  id: z.string().min(1),
  platform: z.enum(["instagram", "tiktok", "facebook"]),
  embedUrl: z.string().url(),
  caption: bilingualStringSchema,
  entrepreneurId: z.string().min(1),
  podcastId: z.string().optional(),
  publishedAt: z.iso.date().optional(),
  published: z.boolean(),
}) satisfies z.ZodType<Reel>;

export const pageCopySchema = z.object({
  slug: z.string().min(1),
  title: bilingualStringSchema,
  sections: z.array(
    z.object({
      heading: bilingualStringSchema.optional(),
      body: bilingualStringSchema,
    }),
  ),
  metadata: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  flags: z.record(z.string(), z.boolean()).optional(),
}) satisfies z.ZodType<PageCopy>;

export const siteCopySchema = z.object({
  nav: z.object({
    home: bilingualStringSchema,
    podcasts: bilingualStringSchema,
    entrepreneurs: bilingualStringSchema,
    reels: bilingualStringSchema,
    about: bilingualStringSchema,
    resources: bilingualStringSchema,
  }),
  footer: z.object({
    tagline: bilingualStringSchema,
    aboutHeading: bilingualStringSchema,
    listenHeading: bilingualStringSchema,
    projectHeading: bilingualStringSchema,
    withdrawLabel: bilingualStringSchema,
    safeguardingLabel: bilingualStringSchema,
    auditLabel: bilingualStringSchema,
    planIbCredit: bilingualStringSchema,
    capecCredit: bilingualStringSchema,
    lastUpdatedLabel: bilingualStringSchema,
    copyright: bilingualStringSchema,
  }),
}) satisfies z.ZodType<SiteCopy>;

export type {
  BilingualString,
  Entrepreneur,
  PageCopy,
  PageCopySection,
  PodcastEpisode,
  Reel,
  SiteCopy,
} from "./types";
