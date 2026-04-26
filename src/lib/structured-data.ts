import type { Entrepreneur, PodcastEpisode } from "./types";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://v2vbridge.capec.consulting"
).replace(/\/+$/, "");

const ORG_NAME = "V2V Bridge";
const ORG_LEGAL_NAME = "Voice to Venture Bridge";
const ORG_DESCRIPTION =
  "A youth-led storytelling project amplifying women entrepreneurs in Satkhira, under Plan International Bangladesh's Youth Equality Award 2026, implemented by CapeC. Consulting.";

type JsonLD = Record<string, unknown>;

export function organizationLD(): JsonLD {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo-placeholder.svg`,
    description: ORG_DESCRIPTION,
    parentOrganization: {
      "@type": "Organization",
      name: "Plan International Bangladesh",
      url: "https://plan-international.org/bangladesh/",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Satkhira District, Bangladesh",
    },
  };
}

export function podcastSeriesLD(): JsonLD {
  return {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    "@id": `${BASE_URL}/podcasts#series`,
    name: `${ORG_NAME} — Voices from Satkhira`,
    url: `${BASE_URL}/podcasts`,
    description:
      "Bilingual podcast episodes featuring women entrepreneurs in Satkhira, Bangladesh.",
    inLanguage: ["en", "bn"],
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function podcastEpisodeLD(episode: PodcastEpisode): JsonLD {
  const url = `${BASE_URL}/podcasts/${episode.id}`;
  const datePublished = episode.publishedAt ?? episode.recordedOn;
  return {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    "@id": `${url}#episode`,
    url,
    name: episode.title.en,
    alternateName: episode.title.bn,
    episodeNumber: episode.episodeNumber,
    description: episode.summary.en,
    inLanguage: ["en", "bn"],
    timeRequired: durationToISO(episode.durationSeconds),
    datePublished,
    partOfSeries: { "@id": `${BASE_URL}/podcasts#series` },
    publisher: { "@id": `${BASE_URL}/#organization` },
  };
}

export function articleLD(entrepreneur: Entrepreneur): JsonLD {
  const url = `${BASE_URL}/entrepreneurs/${entrepreneur.id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: `${entrepreneur.displayName} — ${entrepreneur.sector}`,
    description: entrepreneur.summary.en,
    inLanguage: ["en", "bn"],
    datePublished: entrepreneur.publishedAt,
    author: { "@id": `${BASE_URL}/#organization` },
    publisher: { "@id": `${BASE_URL}/#organization` },
    about: {
      "@type": "Person",
      name: entrepreneur.displayName,
      jobTitle: entrepreneur.sector,
      address: {
        "@type": "PostalAddress",
        addressRegion: entrepreneur.district,
        addressCountry: "BD",
      },
    },
  };
}

function durationToISO(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "PT0S";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  let out = "PT";
  if (h) out += `${h}H`;
  if (m) out += `${m}M`;
  if (s || (!h && !m)) out += `${s}S`;
  return out;
}

export function jsonLDScript(data: JsonLD | JsonLD[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
