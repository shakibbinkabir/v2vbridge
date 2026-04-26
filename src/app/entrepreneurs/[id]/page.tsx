import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SectorIcon } from "@/components/content/SectorIcon";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { FacebookEmbed } from "@/components/embeds/FacebookEmbed";
import { InstagramEmbed } from "@/components/embeds/InstagramEmbed";
import { SpotifyEmbed } from "@/components/embeds/SpotifyEmbed";
import { TikTokEmbed } from "@/components/embeds/TikTokEmbed";
import { BilingualText } from "@/components/ui/BilingualText";
import { Prose } from "@/components/ui/Prose";
import { Tag } from "@/components/ui/Tag";
import {
  getAllEntrepreneurs,
  getAllPublishedPodcasts,
  getReelsByEntrepreneur,
} from "@/lib/content";
import type { BilingualString, Reel } from "@/lib/types";

type Params = Promise<{ id: string }>;

const isDev = process.env.NODE_ENV === "development";

export function generateStaticParams() {
  return getAllEntrepreneurs({ includeUnpublished: true }).map((e) => ({
    id: e.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const entrepreneur = getAllEntrepreneurs({ includeUnpublished: true }).find(
    (e) => e.id === id,
  );
  if (!entrepreneur) {
    return { title: "Entrepreneur not found" };
  }
  const summaryEn = entrepreneur.summary.en;
  const description =
    summaryEn.length > 160 ? `${summaryEn.slice(0, 160)}…` : summaryEn;
  return {
    title: `${entrepreneur.displayName} | V2V Bridge`,
    description,
  };
}

const LISTEN_HEADING: BilingualString = {
  en: "Listen to her story",
  bn: "তাঁর গল্প শুনুন",
};

const LISTEN_LINK: BilingualString = {
  en: "Open the full episode page",
  bn: "সম্পূর্ণ পর্বের পৃষ্ঠা খুলুন",
};

const STORY_COMING_SOON: BilingualString = {
  en: "Story coming soon",
  bn: "শীঘ্রই আসছে",
};

const REELS_HEADING: BilingualString = {
  en: "Watch the reels",
  bn: "রিলগুলি দেখুন",
};

const ABOUT_HEADING: BilingualString = {
  en: "About V2V Bridge",
  bn: "V2V Bridge সম্পর্কে",
};

const ABOUT_BODY: BilingualString = {
  en: "V2V Bridge is a youth-led storytelling project amplifying women entrepreneurs in Satkhira, run under Plan International Bangladesh's Youth Equality Award 2026 and implemented by CapeC. Consulting.",
  bn: "V2V Bridge একটি যুব-নেতৃত্বাধীন গল্পবলা প্রকল্প, যা সাতক্ষীরার নারী উদ্যোক্তাদের কণ্ঠস্বরকে তুলে ধরে। প্ল্যান ইন্টারন্যাশনাল বাংলাদেশের ইয়ুথ ইক্যুয়ালিটি অ্যাওয়ার্ড ২০২৬-এর অধীনে পরিচালিত এবং CapeC. কনসাল্টিং দ্বারা বাস্তবায়িত।",
};

const ABOUT_CTA: BilingualString = {
  en: "Read the full project page",
  bn: "প্রকল্পের সম্পূর্ণ পৃষ্ঠা পড়ুন",
};

function ReelEmbed({ reel }: { reel: Reel }) {
  switch (reel.platform) {
    case "instagram":
      return <InstagramEmbed embedUrl={reel.embedUrl} />;
    case "tiktok":
      return <TikTokEmbed embedUrl={reel.embedUrl} />;
    case "facebook":
      return <FacebookEmbed embedUrl={reel.embedUrl} />;
  }
}

export default async function EntrepreneurDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const entrepreneur = getAllEntrepreneurs({ includeUnpublished: true }).find(
    (e) => e.id === id,
  );
  if (!entrepreneur) notFound();
  if (!entrepreneur.published && !isDev) notFound();

  const showPhoto =
    entrepreneur.photoConsent === true && Boolean(entrepreneur.photo);

  const linkedPodcast = entrepreneur.podcastId
    ? getAllPublishedPodcasts().find((p) => p.id === entrepreneur.podcastId)
    : undefined;

  const reels = getReelsByEntrepreneur(entrepreneur.id);

  return (
    <>
      <section className="bg-brand-cream">
        <Container className="grid items-center gap-10 py-14 sm:py-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-rule/60 bg-brand-cream">
            {showPhoto && entrepreneur.photo ? (
              <Image
                src={entrepreneur.photo}
                alt={`Portrait of ${entrepreneur.displayName}`}
                fill
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-cream p-10">
                <SectorIcon
                  sector={entrepreneur.sector}
                  className="h-44 w-44 sm:h-56 sm:w-56"
                  title={`${entrepreneur.sector} sector icon (no portrait shown)`}
                />
              </div>
            )}
          </div>

          <div>
            <h1 className="font-sans text-4xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-5xl">
              {entrepreneur.displayName}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag>{entrepreneur.sector}</Tag>
              <Tag variant="teal">{entrepreneur.district}</Tag>
            </div>
            <div className="mt-8">
              <Prose>
                <p>
                  <span lang="en" className="font-sans">{entrepreneur.summary.en}</span>
                  <span lang="bn" className="font-bangla">{entrepreneur.summary.bn}</span>
                </p>
              </Prose>
            </div>
          </div>
        </Container>
      </section>

      {entrepreneur.podcastId ? (
        <Section tone="white" as="section">
          <BilingualText
            content={LISTEN_HEADING}
            as="h2"
            className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
          />
          <div className="mt-6">
            {linkedPodcast ? (
              <div className="space-y-4">
                <SpotifyEmbed
                  embedId={linkedPodcast.embed.embedId}
                  title={linkedPodcast.title.en}
                />
                <Link
                  href={`/podcasts/${linkedPodcast.id}`}
                  className="inline-flex items-center text-base font-medium text-brand-teal underline-offset-4 hover:underline"
                >
                  <span lang="en" className="font-sans">{LISTEN_LINK.en} →</span>
                  <span lang="bn" className="font-bangla">{LISTEN_LINK.bn} →</span>
                </Link>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-brand-rule bg-brand-cream/60 px-6 py-10 text-center">
                <p className="text-base font-medium text-brand-teal">
                  <span lang="en" className="font-sans">{STORY_COMING_SOON.en}</span>
                  <span lang="bn" className="font-bangla">{STORY_COMING_SOON.bn}</span>
                </p>
              </div>
            )}
          </div>
        </Section>
      ) : null}

      {reels.length > 0 ? (
        <Section tone="cream" as="section">
          <BilingualText
            content={REELS_HEADING}
            as="h2"
            className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {reels.map((reel) => (
              <ReelEmbed key={reel.id} reel={reel} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white" as="section" contained={false}>
        <Container className="max-w-3xl text-center">
          <BilingualText
            content={ABOUT_HEADING}
            as="h2"
            className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
          />
          <BilingualText
            content={ABOUT_BODY}
            as="p"
            className="mt-6 text-lg text-brand-ink/90"
          />
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center text-base font-medium text-brand-teal underline-offset-4 hover:underline"
            >
              <span lang="en" className="font-sans">{ABOUT_CTA.en} →</span>
              <span lang="bn" className="font-bangla">{ABOUT_CTA.bn} →</span>
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
