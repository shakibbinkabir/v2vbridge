export type BilingualString = { en: string; bn: string };

export type EmbedProvider = "spotify" | "anchor" | "youtube";
export type ReelPlatform = "instagram" | "tiktok" | "facebook";

export interface Entrepreneur {
  id: string;
  displayName: string;
  sector: string;
  district: string;
  photo?: string;
  photoConsent: boolean;
  summary: BilingualString;
  podcastId?: string;
  reelIds: string[];
  consentFormFilename: string;
  publishedAt?: string;
  published: boolean;
  reviewers: { ysc1: string; ysc2: string; projectLead: string };
}

export interface PodcastEpisode {
  id: string;
  episodeNumber: number;
  title: BilingualString;
  summary: BilingualString;
  embed: { provider: EmbedProvider; embedId: string };
  durationSeconds: number;
  recordedOn: string;
  publishedAt?: string;
  published: boolean;
  entrepreneurId: string;
  transcriptUrl?: string;
}

export interface Reel {
  id: string;
  platform: ReelPlatform;
  embedUrl: string;
  caption: BilingualString;
  entrepreneurId: string;
  podcastId?: string;
  publishedAt?: string;
  published: boolean;
}

export interface PageCopySection {
  heading?: BilingualString;
  body: BilingualString;
}

export interface PageCopy {
  slug: string;
  title: BilingualString;
  sections: PageCopySection[];
  metadata: {
    title: string;
    description: string;
  };
  flags?: Record<string, boolean>;
}

export interface SiteCopy {
  nav: {
    home: BilingualString;
    podcasts: BilingualString;
    entrepreneurs: BilingualString;
    reels: BilingualString;
    about: BilingualString;
    resources: BilingualString;
  };
  footer: {
    tagline: BilingualString;
    aboutHeading: BilingualString;
    listenHeading: BilingualString;
    projectHeading: BilingualString;
    withdrawLabel: BilingualString;
    safeguardingLabel: BilingualString;
    auditLabel: BilingualString;
    planIbCredit: BilingualString;
    capecCredit: BilingualString;
    lastUpdatedLabel: BilingualString;
    copyright: BilingualString;
  };
}
