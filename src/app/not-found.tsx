import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for is not on the V2V Bridge site.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <>
      <Hero
        kicker={{ en: "404", bn: "৪০৪" }}
        title={{
          en: "Page not found",
          bn: "পৃষ্ঠা পাওয়া যায়নি",
        }}
        intro={{
          en: "The page you were looking for has moved, been removed, or never existed. Check the URL, or jump back into the project from one of the links below.",
          bn: "আপনি যে পৃষ্ঠাটি খুঁজছিলেন সেটি সরানো হয়েছে, মুছে ফেলা হয়েছে, অথবা কখনো ছিল না। URL টি যাচাই করুন, অথবা নিচের লিঙ্কগুলির একটি দিয়ে প্রকল্পে ফিরে যান।",
        }}
        actions={
          <>
            <Button href="/" variant="primary">
              <span lang="en" className="font-sans">Back to home</span>
              <span lang="bn" className="font-bangla">হোমে ফিরুন</span>
            </Button>
            <Button href="/podcasts" variant="secondary">
              <span lang="en" className="font-sans">Listen to podcasts</span>
              <span lang="bn" className="font-bangla">পডকাস্ট শুনুন</span>
            </Button>
          </>
        }
      />
      <Container className="py-12">
        <p className="text-sm text-brand-mute">
          <span lang="en" className="font-sans">
            If you arrived here by following a link from another site, please let
            us know — see the contact options on the{" "}
            <a
              href="/about"
              className="text-brand-teal underline underline-offset-4"
            >
              About
            </a>{" "}
            page.
          </span>
          <span lang="bn" className="font-bangla">
            অন্য কোনো সাইটের লিঙ্ক থেকে এখানে এসে থাকলে আমাদের জানান —{" "}
            <a
              href="/about"
              className="text-brand-teal underline underline-offset-4"
            >
              পরিচিতি
            </a>{" "}
            পৃষ্ঠায় যোগাযোগের তথ্য রয়েছে।
          </span>
        </p>
      </Container>
    </>
  );
}
