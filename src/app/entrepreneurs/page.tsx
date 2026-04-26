import type { Metadata } from "next";

import { EntrepreneurCard } from "@/components/content/EntrepreneurCard";
import { Section } from "@/components/layout/Section";
import { Hero } from "@/components/ui/Hero";
import { getAllEntrepreneurs } from "@/lib/content";
import type { BilingualString, Entrepreneur } from "@/lib/types";

const HERO_TITLE: BilingualString = {
  en: "Entrepreneurs",
  bn: "উদ্যোক্তা",
};

const HERO_KICKER: BilingualString = {
  en: "Voices from Satkhira",
  bn: "সাতক্ষীরার কণ্ঠস্বর",
};

const HERO_INTRO: BilingualString = {
  en: "Women running small ventures across tailoring, fish drying, dairy, handicraft, and organic farming. Each profile pairs a podcast with reels recorded in their workshops.",
  bn: "সাতক্ষীরায় টেইলারিং, শুঁটকি, দুগ্ধ, হস্তশিল্প ও জৈব কৃষিতে ছোট উদ্যোগ চালাচ্ছেন এমন নারীদের কথা। প্রতিটি প্রোফাইলে একটি পডকাস্টের সঙ্গে কর্মশালায় রেকর্ড করা রিল রয়েছে।",
};

const EMPTY_TITLE: BilingualString = {
  en: "Stories publishing May–June 2026",
  bn: "গল্পগুলি মে–জুন ২০২৬-এ প্রকাশ হবে",
};

export const metadata: Metadata = {
  title: "Entrepreneurs",
  description:
    "Profiles of women entrepreneurs in Satkhira whose stories anchor the V2V Bridge podcast.",
  openGraph: {
    title: "Entrepreneurs | V2V Bridge",
    description:
      "Profiles of women entrepreneurs in Satkhira whose stories anchor the V2V Bridge podcast.",
    images: [{ url: "/og/entrepreneurs.png", width: 1200, height: 630 }],
  },
};

function sortEntrepreneurs(items: Entrepreneur[]): Entrepreneur[] {
  return [...items].sort((a, b) => {
    if (a.publishedAt && b.publishedAt) {
      return b.publishedAt.localeCompare(a.publishedAt);
    }
    if (a.publishedAt && !b.publishedAt) return -1;
    if (!a.publishedAt && b.publishedAt) return 1;
    return a.id.localeCompare(b.id);
  });
}

export default function EntrepreneursIndexPage() {
  const entrepreneurs = sortEntrepreneurs(getAllEntrepreneurs());

  return (
    <>
      <Hero title={HERO_TITLE} kicker={HERO_KICKER} intro={HERO_INTRO} />

      <Section tone="white" as="section">
        {entrepreneurs.length > 0 ? (
          <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {entrepreneurs.map((e) => (
              <li key={e.id}>
                <EntrepreneurCard entrepreneur={e} />
              </li>
            ))}
          </ul>
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
