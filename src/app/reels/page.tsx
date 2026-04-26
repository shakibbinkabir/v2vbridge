import type { Metadata } from "next";

import { ReelCard } from "@/components/content/ReelCard";
import { Section } from "@/components/layout/Section";
import { Hero } from "@/components/ui/Hero";
import { getAllPublishedReels } from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const HERO_TITLE: BilingualString = {
  en: "Reels",
  bn: "রিল",
};

const HERO_KICKER: BilingualString = {
  en: "Voices in motion",
  bn: "চলমান কণ্ঠস্বর",
};

const HERO_INTRO: BilingualString = {
  en: "Short clips recorded in workshops and homes across Satkhira. Tap any reel to read the entrepreneur's full story.",
  bn: "সাতক্ষীরা জুড়ে কর্মশালা ও বাড়িতে রেকর্ড করা ছোট ভিডিও। কোনো রিলে ট্যাপ করে উদ্যোক্তার সম্পূর্ণ গল্প পড়ুন।",
};

const EMPTY_TITLE: BilingualString = {
  en: "Reels publishing May–June 2026",
  bn: "রিলগুলি মে–জুন ২০২৬-এ প্রকাশ হবে",
};

export const metadata: Metadata = {
  title: "Reels",
  description:
    "Short reels from V2V Bridge entrepreneurs across Satkhira, linked to their full stories.",
  openGraph: {
    title: "Reels | V2V Bridge",
    description:
      "Short reels from V2V Bridge entrepreneurs across Satkhira, linked to their full stories.",
    images: [{ url: "/og/reels.png", width: 1200, height: 630 }],
  },
};

export default function ReelsGalleryPage() {
  const reels = getAllPublishedReels();

  return (
    <>
      <Hero title={HERO_TITLE} kicker={HERO_KICKER} intro={HERO_INTRO} />

      <Section tone="white" as="section">
        {reels.length > 0 ? (
          <div className="gap-6 [column-gap:1.5rem] columns-1 sm:columns-2 lg:columns-3">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="mb-6 break-inside-avoid [break-inside:avoid]"
              >
                <ReelCard reel={reel} linkTo="entrepreneur" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-brand-rule bg-brand-cream/60 px-6 py-16 text-center">
            <p className="text-base font-medium text-brand-teal">
              <span lang="en" className="font-sans">{EMPTY_TITLE.en}</span>
              <span lang="bn" className="font-bangla">{EMPTY_TITLE.bn}</span>
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
