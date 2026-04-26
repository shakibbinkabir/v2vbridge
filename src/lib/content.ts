import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { ZodType } from "zod";

import {
  entrepreneurSchema,
  pageCopySchema,
  podcastEpisodeSchema,
  reelSchema,
  siteCopySchema,
} from "./schemas";
import type {
  Entrepreneur,
  PageCopy,
  PodcastEpisode,
  Reel,
  SiteCopy,
} from "./types";

const CONTENT_ROOT = join(process.cwd(), "content");
const isDev = process.env.NODE_ENV === "development";

function readJSONDir<T>(subdir: string, schema: ZodType<T>): T[] {
  const dir = join(CONTENT_ROOT, subdir);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const fullPath = join(dir, file);
    const raw = readFileSync(fullPath, "utf8");
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      throw new Error(
        `Invalid JSON in content/${subdir}/${file}: ${(err as Error).message}`,
      );
    }
    const result = schema.safeParse(parsed);
    if (!result.success) {
      throw new Error(
        `Schema validation failed for content/${subdir}/${file}:\n${result.error.message}`,
      );
    }
    return result.data;
  });
}

function readJSONFile<T>(relPath: string, schema: ZodType<T>): T {
  const fullPath = join(CONTENT_ROOT, relPath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required content file: content/${relPath}`);
  }
  const raw = readFileSync(fullPath, "utf8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Invalid JSON in content/${relPath}: ${(err as Error).message}`,
    );
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Schema validation failed for content/${relPath}:\n${result.error.message}`,
    );
  }
  return result.data;
}

let entrepreneursCache: Entrepreneur[] | null = null;
let podcastsCache: PodcastEpisode[] | null = null;
let reelsCache: Reel[] | null = null;
let siteCopyCache: SiteCopy | null = null;

function loadEntrepreneurs(): Entrepreneur[] {
  if (!entrepreneursCache) {
    entrepreneursCache = readJSONDir("entrepreneurs", entrepreneurSchema);
  }
  return entrepreneursCache;
}

function loadPodcasts(): PodcastEpisode[] {
  if (!podcastsCache) {
    podcastsCache = readJSONDir("podcasts", podcastEpisodeSchema);
  }
  return podcastsCache;
}

function loadReels(): Reel[] {
  if (!reelsCache) reelsCache = readJSONDir("reels", reelSchema);
  return reelsCache;
}

function devFallback<T extends { published: boolean }>(items: T[]): T[] {
  const published = items.filter((i) => i.published);
  if (published.length === 0 && isDev) return items;
  return published;
}

export function getAllEntrepreneurs(opts?: {
  includeUnpublished?: boolean;
}): Entrepreneur[] {
  const all = loadEntrepreneurs();
  if (opts?.includeUnpublished) return all;
  return devFallback(all);
}

export function getEntrepreneur(id: string): Entrepreneur | null {
  return loadEntrepreneurs().find((e) => e.id === id) ?? null;
}

export function getAllPublishedPodcasts(): PodcastEpisode[] {
  return devFallback(loadPodcasts()).sort(
    (a, b) => b.episodeNumber - a.episodeNumber,
  );
}

export function getPodcast(id: string): PodcastEpisode | null {
  return loadPodcasts().find((p) => p.id === id) ?? null;
}

export function getAllPublishedReels(): Reel[] {
  return devFallback(loadReels());
}

// Raw, unfiltered loaders. Use only for the /dev verification page or
// internal tooling — never for public-facing pages, which must respect
// the `published` flag through getAllPublished*.
export function _getAllPodcastsRaw(): PodcastEpisode[] {
  return [...loadPodcasts()];
}

export function _getAllReelsRaw(): Reel[] {
  return [...loadReels()];
}

export function getReelsByEntrepreneur(id: string): Reel[] {
  return getAllPublishedReels().filter((r) => r.entrepreneurId === id);
}

export function getPodcastsByEntrepreneur(id: string): PodcastEpisode[] {
  return getAllPublishedPodcasts().filter((p) => p.entrepreneurId === id);
}

export function getPageCopy(slug: string): PageCopy {
  return readJSONFile(`pages/${slug}.json`, pageCopySchema);
}

export function getSiteCopy(): SiteCopy {
  if (!siteCopyCache) {
    siteCopyCache = readJSONFile("pages/site.json", siteCopySchema);
  }
  return siteCopyCache;
}
