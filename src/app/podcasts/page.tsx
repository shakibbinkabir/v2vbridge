import type { Metadata } from "next";

import { PodcastCard } from "@/components/content/PodcastCard";
import { Section } from "@/components/layout/Section";
import { Hero } from "@/components/ui/Hero";
import { getAllPublishedPodcasts, getEntrepreneur } from "@/lib/content";

export const metadata: Metadata = {
  title: "Podcasts",
  description:
    "Long-form bilingual conversations with women entrepreneurs in Satkhira, recorded by the V2V Bridge youth team.",
};

export default function PodcastsIndexPage() {
  const podcasts = getAllPublishedPodcasts();

  return (
    <>
      <Hero
        kicker={{ en: "Listen", bn: "শুনুন" }}
        title={{ en: "Podcasts", bn: "পডকাস্ট" }}
        intro={{
          en: "Long-form conversations with women entrepreneurs in Satkhira — every episode in their own voice, with bilingual context for English-language listeners.",
          bn: "সাতক্ষীরার নারী উদ্যোক্তাদের সঙ্গে দীর্ঘ আলাপ — প্রতিটি পর্ব তাঁদের নিজের কণ্ঠে, ইংরেজি শ্রোতাদের জন্য দ্বিভাষিক প্রেক্ষাপট সহ।",
        }}
      />

      <Section tone="white">
        {podcasts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-brand-ink/85">
              <span lang="en" className="font-sans">Episodes publishing May–June 2026</span>
              <span lang="bn" className="font-bangla">এপিসোডগুলি মে–জুন ২০২৬-এ প্রকাশ হবে</span>
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {podcasts.map((podcast) => {
              const entrepreneur = getEntrepreneur(podcast.entrepreneurId);
              return (
                <li key={podcast.id}>
                  <PodcastCard
                    podcast={podcast}
                    sectorLabel={entrepreneur?.sector}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
