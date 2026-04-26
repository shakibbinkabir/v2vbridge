import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
import { Prose } from "@/components/ui/Prose";
import { getPageCopy } from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const safeguarding = getPageCopy("safeguarding");

export const metadata = {
  title: safeguarding.metadata.title,
  description: safeguarding.metadata.description,
};

const CALLOUT_TITLE: BilingualString = {
  en: "Report a safeguarding concern",
  bn: "সুরক্ষাসংক্রান্ত উদ্বেগ জানান",
};

const CALLOUT_BODY: BilingualString = {
  en: "If something on this site looks like a safeguarding breach to you, please get in touch with the Plan International Bangladesh focal point listed on the withdraw page. We take concerns offline within 24 hours of the first report while we review them.",
  bn: "এই সাইটে এমন কিছু চোখে পড়লে যা আপনাকে সুরক্ষা লঙ্ঘনের মতো মনে হয়, দয়া করে withdraw পৃষ্ঠায় তালিকাভুক্ত প্ল্যান ইন্টারন্যাশনাল বাংলাদেশের ফোকাল পয়েন্টের সঙ্গে যোগাযোগ করুন। প্রথম প্রতিবেদনের ২৪ ঘণ্টার মধ্যে আমরা সংশ্লিষ্ট উপাদান অফলাইনে নিয়ে যাই — পর্যালোচনা চলাকালে।",
};

const CALLOUT_CTA: BilingualString = {
  en: "Open the withdraw page",
  bn: "withdraw পৃষ্ঠা খুলুন",
};

export default function SafeguardingPage() {
  return (
    <>
      <Hero title={safeguarding.title} />

      <Section tone="white" as="section" contained={false}>
        <Container className="max-w-3xl">
          <Prose>
            {safeguarding.sections.map((section, index) => (
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
          <aside
            role="note"
            aria-labelledby="report-concern-heading"
            className="rounded-lg border-l-4 border-brand-coral bg-white p-6 shadow-sm"
          >
            <BilingualText
              content={CALLOUT_TITLE}
              as="h2"
              className="font-sans text-xl font-semibold text-brand-teal"
              enClassName=""
            />
            <p id="report-concern-heading" className="sr-only">
              {CALLOUT_TITLE.en}
            </p>
            <BilingualText
              content={CALLOUT_BODY}
              as="p"
              className="mt-3 text-base text-brand-ink/90"
            />
            <div className="mt-5">
              <Button href="/withdraw" variant="primary">
                <span lang="en" className="font-sans">{CALLOUT_CTA.en}</span>
                <span lang="bn" className="font-bangla">{CALLOUT_CTA.bn}</span>
              </Button>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
