import Link from "next/link";

import { PodcastCard } from "@/components/content/PodcastCard";
import { ReelCard } from "@/components/content/ReelCard";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
import {
  getAllPublishedPodcasts,
  getAllPublishedReels,
  getEntrepreneur,
  getPageCopy,
} from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const home = getPageCopy("home");

export const metadata = {
  title: home.metadata.title,
  description: home.metadata.description,
};

const KICKER: BilingualString = {
  en: "Plan IB · Youth Equality Award 2026 · CapeC.",
  bn: "প্ল্যান আইবি · ইয়ুথ ইক্যুয়ালিটি অ্যাওয়ার্ড ২০২৬ · CapeC.",
};

const CTA_LISTEN: BilingualString = {
  en: "Listen to the stories",
  bn: "গল্পগুলি শুনুন",
};

const CTA_ABOUT: BilingualString = {
  en: "About the project",
  bn: "প্রকল্প সম্পর্কে",
};

const LATEST_STORIES: BilingualString = {
  en: "Latest stories",
  bn: "সর্বশেষ গল্প",
};

const LATEST_REELS: BilingualString = {
  en: "Latest reels",
  bn: "সর্বশেষ রিল",
};

const COMING_SOON: BilingualString = {
  en: "Coming May–June 2026",
  bn: "আসছে মে–জুন ২০২৬",
};

const ABOUT_CTA: BilingualString = {
  en: "Read the full project page",
  bn: "প্রকল্পের সম্পূর্ণ পৃষ্ঠা পড়ুন",
};

function ComingSoon({ note }: { note: BilingualString }) {
  return (
    <div className="rounded-lg border border-dashed border-brand-rule bg-white px-6 py-10 text-center">
      <p className="text-base font-medium text-brand-teal">
        <span lang="en" className="font-sans">{note.en}</span>
        <span lang="bn" className="font-bangla">{note.bn}</span>
      </p>
    </div>
  );
}

export default function HomePage() {
  const podcasts = getAllPublishedPodcasts().slice(0, 3);
  const reels = getAllPublishedReels().slice(0, 6);
  const aboutTeaser = home.sections[0];

  return (
    <>
      <Hero
        title={home.title}
        kicker={KICKER}
        actions={
          <>
            <Button href="/podcasts" variant="primary" size="lg">
              <span lang="en" className="font-sans">{CTA_LISTEN.en}</span>
              <span lang="bn" className="font-bangla">{CTA_LISTEN.bn}</span>
            </Button>
            <Button href="/about" variant="secondary" size="lg">
              <span lang="en" className="font-sans">{CTA_ABOUT.en}</span>
              <span lang="bn" className="font-bangla">{CTA_ABOUT.bn}</span>
            </Button>
          </>
        }
      />

      <Section tone="white" as="section">
        <BilingualText
          content={LATEST_STORIES}
          as="h2"
          className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
        />
        <div className="mt-8">
          {podcasts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {podcasts.map((p) => {
                const ent = getEntrepreneur(p.entrepreneurId);
                return (
                  <PodcastCard
                    key={p.id}
                    podcast={p}
                    sectorLabel={ent?.sector}
                  />
                );
              })}
            </div>
          ) : (
            <ComingSoon note={COMING_SOON} />
          )}
        </div>
      </Section>

      <Section tone="cream" as="section">
        <BilingualText
          content={LATEST_REELS}
          as="h2"
          className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
        />
        <div className="mt-8">
          {reels.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reels.map((r) => (
                <ReelCard key={r.id} reel={r} />
              ))}
            </div>
          ) : (
            <ComingSoon note={COMING_SOON} />
          )}
        </div>
      </Section>

      {aboutTeaser ? (
        <Section tone="white" as="section" contained={false}>
          <Container className="max-w-3xl text-center">
            {aboutTeaser.heading ? (
              <BilingualText
                content={aboutTeaser.heading}
                as="h2"
                className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
              />
            ) : null}
            <BilingualText
              content={aboutTeaser.body}
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
      ) : null}
    </>
  );
}
