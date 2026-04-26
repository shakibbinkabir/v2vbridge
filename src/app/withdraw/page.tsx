import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { BilingualText } from "@/components/ui/BilingualText";
import { Hero } from "@/components/ui/Hero";
import { Prose } from "@/components/ui/Prose";
import { getPageCopy } from "@/lib/content";
import type { BilingualString } from "@/lib/types";

const withdraw = getPageCopy("withdraw");

export const metadata = {
  title: withdraw.metadata.title,
  description: withdraw.metadata.description,
};

const SUMMARY: BilingualString = {
  en: "Anything we publish about you on this site stays yours to take back. The page below explains exactly how — and what we can and cannot recover once content is in the world.",
  bn: "এই সাইটে আমরা আপনার সম্পর্কে যা প্রকাশ করি তা ফিরিয়ে নেওয়ার অধিকার আপনারই। নিচের পৃষ্ঠায় ঠিক কীভাবে — এবং কনটেন্ট জনপরিসরে চলে গেলে আমরা কী ফিরিয়ে আনতে পারি, কী পারি না — তা ব্যাখ্যা করা আছে।",
};

export default function WithdrawPage() {
  return (
    <>
      <Hero title={withdraw.title} intro={SUMMARY} />

      <Section tone="white" as="section" contained={false}>
        <Container className="max-w-3xl">
          <Prose>
            {withdraw.sections.map((section, index) => (
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
    </>
  );
}
