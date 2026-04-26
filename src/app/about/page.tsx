import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Hero } from "@/components/ui/Hero";
import { Prose } from "@/components/ui/Prose";
import { getPageCopy } from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const about = getPageCopy("about");

export const metadata = {
  title: about.metadata.title,
  description: about.metadata.description,
};

const CREDITS_HEADING: BilingualString = {
  en: "With thanks to",
  bn: "কৃতজ্ঞতা"
};

type Credit = {
  role: BilingualString;
  who: string;
};

const CREDITS: Credit[] = [
  {
    role: { en: "Funder", bn: "অর্থায়নকারী" },
    who: "Plan International Bangladesh — Youth Equality Award 2026",
  },
  {
    role: { en: "Implementer", bn: "বাস্তবায়নকারী" },
    who: "CapeC. Consulting (Satkhira & Dhaka)",
  },
  {
    role: { en: "Hosting & infrastructure", bn: "হোস্টিং ও অবকাঠামো" },
    who: "Vercel · Spotify for Podcasters",
  },
];

export default function AboutPage() {
  return (
    <>
      <Hero title={about.title} />

      <Section tone="white" as="section" contained={false}>
        <Container className="max-w-3xl">
          <Prose>
            {about.sections.map((section, index) => (
              <div key={index} className="space-y-4">
                {section.heading ? (
                  <BilingualText content={section.heading} as="h2" />
                ) : null}
                <BilingualText content={section.body} as="p" />
              </div>
            ))}
          </Prose>
        </Container>
      </Section>

      <Section tone="cream" as="section" contained={false}>
        <Container className="max-w-3xl">
          <BilingualText
            content={CREDITS_HEADING}
            as="h2"
            className="font-sans text-2xl font-semibold text-brand-teal sm:text-3xl"
          />
          <dl className="mt-6 space-y-4">
            {CREDITS.map((credit) => (
              <div
                key={credit.who}
                className="grid gap-1 rounded-lg border border-brand-rule/60 bg-white p-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="text-sm font-semibold uppercase tracking-wide text-brand-coral">
                  <span lang="en" className="font-sans">{credit.role.en}</span>
                  <span lang="bn" className="font-bangla">{credit.role.bn}</span>
                </dt>
                <dd className="font-sans text-base text-brand-ink/90">
                  {credit.who}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
    </>
  );
}
