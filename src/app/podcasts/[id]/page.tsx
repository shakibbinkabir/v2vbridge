import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EntrepreneurCard } from "@/components/content/EntrepreneurCard";
import { ReelCard } from "@/components/content/ReelCard";
import { SpotifyEmbed } from "@/components/embeds/SpotifyEmbed";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Card } from "@/components/ui/Card";
import { Prose } from "@/components/ui/Prose";
import {
  _getAllPodcastsRaw,
  getAllPublishedPodcasts,
  getEntrepreneur,
  getPodcast,
  getReelsByEntrepreneur,
} from "@/lib/content";
import {
  formatBanglaNumber,
  formatDate,
  formatDuration,
} from "@/lib/format";

type RouteParams = { id: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  const published = getAllPublishedPodcasts();
  if (published.length > 0) {
    return published.map((p) => ({ id: p.id }));
  }
  // See coordination/blockers.md B-001. With every seed record
  // `published: false`, `output: "export"` refuses an empty params
  // list. Fall back to raw IDs so the build succeeds; the page itself
  // still calls notFound() for unpublished records.
  return _getAllPodcastsRaw().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const podcast = getPodcast(id);
  if (!podcast || !podcast.published) {
    return { title: "Episode not found" };
  }
  return {
    title: `${podcast.title.en} | V2V Bridge Podcast`,
    description: `${podcast.summary.en.slice(0, 160)}…`,
  };
}

export default async function PodcastDetailPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id } = await params;
  const podcast = getPodcast(id);
  if (!podcast || !podcast.published) notFound();

  const entrepreneur = getEntrepreneur(podcast.entrepreneurId);
  const relatedReels = getReelsByEntrepreneur(podcast.entrepreneurId).slice(
    0,
    4,
  );

  const epEn = podcast.episodeNumber.toString();
  const epBn = formatBanglaNumber(podcast.episodeNumber);

  return (
    <>
      <Section tone="cream">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-coral">
            <span lang="en" className="font-sans">Episode {epEn}</span>
            <span lang="bn" className="font-bangla">এপিসোড {epBn}</span>
          </p>

          <BilingualText
            content={podcast.title}
            as="h1"
            className="mt-4 font-sans text-4xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-5xl"
          />

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-mute">
            <span lang="en" className="font-sans">
              Recorded{" "}
              <time dateTime={podcast.recordedOn}>
                {formatDate(podcast.recordedOn, "en")}
              </time>
            </span>
            <span lang="bn" className="font-bangla">
              রেকর্ড{" "}
              <time dateTime={podcast.recordedOn}>
                {formatDate(podcast.recordedOn, "bn")}
              </time>
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-sans">{formatDuration(podcast.durationSeconds)}</span>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-3xl">
          <SpotifyEmbed
            embedId={podcast.embed.embedId}
            title={podcast.title.en}
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr] lg:items-start">
          <Prose>
            <BilingualText content={podcast.summary} as="p" />
          </Prose>

          <aside
            aria-labelledby="featured-entrepreneur-heading"
            className="space-y-3"
          >
            <h2
              id="featured-entrepreneur-heading"
              className="text-sm font-semibold uppercase tracking-wide text-brand-teal"
            >
              <span lang="en" className="font-sans">Featured entrepreneur</span>
              <span lang="bn" className="font-bangla">আলোচ্য উদ্যোক্তা</span>
            </h2>
            {entrepreneur && entrepreneur.published ? (
              <EntrepreneurCard entrepreneur={entrepreneur} />
            ) : entrepreneur ? (
              <Card className="p-5">
                <p className="font-sans text-base font-semibold text-brand-teal">
                  {entrepreneur.displayName}
                </p>
                <p className="mt-1 text-xs text-brand-mute">
                  <span lang="en" className="font-sans">Profile not yet published.</span>
                  <span lang="bn" className="font-bangla">প্রোফাইল এখনও প্রকাশিত হয়নি।</span>
                </p>
              </Card>
            ) : null}
          </aside>
        </div>
      </Section>

      {relatedReels.length > 0 ? (
        <Section tone="cream">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl font-semibold text-brand-teal">
              <span lang="en" className="font-sans">Related reels</span>
              <span lang="bn" className="font-bangla">সম্পর্কিত রিল</span>
            </h2>
          </div>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedReels.map((reel) => (
              <li key={reel.id}>
                <ReelCard reel={reel} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
