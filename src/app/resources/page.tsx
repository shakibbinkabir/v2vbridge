import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
import { Prose } from "@/components/ui/Prose";
import { getPageCopy } from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const resources = getPageCopy("resources");

export const metadata = {
  title: resources.metadata.title,
  description: resources.metadata.description,
};

const BRIEF_HEADING: BilingualString = {
  en: "Final learning brief",
  bn: "চূড়ান্ত শিক্ষা সংক্ষেপ",
};

const BRIEF_AVAILABLE: BilingualString = {
  en: "Download the learning brief (PDF)",
  bn: "শিক্ষা সংক্ষেপ ডাউনলোড করুন (PDF)",
};

const BRIEF_PENDING: BilingualString = {
  en: "Available June 2026",
  bn: "জুন ২০২৬-এ উপলব্ধ",
};

const BRIEF_NOTE: BilingualString = {
  en: "When the brief lands, the content team adds /learning-brief.pdf to the project and the link below activates automatically.",
  bn: "সংক্ষেপটি প্রস্তুত হলে কনটেন্ট দল প্রকল্পে /learning-brief.pdf যোগ করেন; নিচের লিঙ্কটি স্বয়ংক্রিয়ভাবে সক্রিয় হয়।",
};

export default function ResourcesPage() {
  const briefAvailable = resources.flags?.learningBriefAvailable === true;
  return (
    <>
      <Hero title={resources.title} />

      <Section tone="white" as="section" contained={false}>
        <Container className="max-w-3xl">
          <Prose>
            {resources.sections.map((section, index) => (
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
          <div className="rounded-lg border border-brand-rule/70 bg-white p-6 shadow-sm">
            <BilingualText
              content={BRIEF_HEADING}
              as="h2"
              className="font-sans text-xl font-semibold text-brand-teal"
            />
            <BilingualText
              content={BRIEF_NOTE}
              as="p"
              className="mt-3 text-sm text-brand-ink/85"
            />
            <div className="mt-5">
              {briefAvailable ? (
                <Button href="/learning-brief.pdf" variant="primary">
                  <span lang="en" className="font-sans">{BRIEF_AVAILABLE.en}</span>
                  <span lang="bn" className="font-bangla">{BRIEF_AVAILABLE.bn}</span>
                </Button>
              ) : (
                <span
                  className="inline-flex items-center rounded-full border border-brand-coral/40 bg-brand-cream px-4 py-2 text-sm font-medium text-brand-coral"
                  aria-disabled="true"
                >
                  <span lang="en" className="font-sans">{BRIEF_PENDING.en}</span>
                  <span lang="bn" className="font-bangla">{BRIEF_PENDING.bn}</span>
                </span>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
