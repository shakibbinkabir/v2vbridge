import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { SiteCopy } from "@/lib/types";

import { Container } from "./Container";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

const STATIC_NAV = [
  { href: "/podcasts", en: "Podcasts", bn: "পডকাস্ট" },
  { href: "/entrepreneurs", en: "Entrepreneurs", bn: "উদ্যোক্তা" },
  { href: "/reels", en: "Reels", bn: "রিল" },
  { href: "/resources", en: "Resources", bn: "সম্পদ" },
];

export function Footer({ site }: { site: SiteCopy }) {
  const f = site.footer;
  return (
    <footer className="border-t border-brand-rule/60 bg-white text-brand-ink">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-sans text-base font-semibold text-brand-teal">
            V2V Bridge
          </p>
          <p className="mt-2 text-sm text-brand-mute">
            <span lang="en" className="font-sans">{f.tagline.en}</span>
            <span lang="bn" className="font-bangla">{f.tagline.bn}</span>
          </p>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-brand-teal">
            <span lang="en">{f.aboutHeading.en}</span>
            <span lang="bn" className="font-bangla">{f.aboutHeading.bn}</span>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-brand-teal">
                <span lang="en" className="font-sans">About</span>
                <span lang="bn" className="font-bangla">পরিচিতি</span>
              </Link>
            </li>
            <li>
              <Link href="/safeguarding" className="hover:text-brand-teal">
                <span lang="en" className="font-sans">{f.safeguardingLabel.en}</span>
                <span lang="bn" className="font-bangla">{f.safeguardingLabel.bn}</span>
              </Link>
            </li>
            <li>
              <Link href="/withdraw" className="hover:text-brand-teal">
                <span lang="en" className="font-sans">{f.withdrawLabel.en}</span>
                <span lang="bn" className="font-bangla">{f.withdrawLabel.bn}</span>
              </Link>
            </li>
            <li>
              <Link href="/audit" className="text-brand-mute hover:text-brand-teal">
                <span lang="en" className="font-sans">{f.auditLabel.en}</span>
                <span lang="bn" className="font-bangla">{f.auditLabel.bn}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-sm font-semibold uppercase tracking-wide text-brand-teal">
            <span lang="en">{f.listenHeading.en}</span>
            <span lang="bn" className="font-bangla">{f.listenHeading.bn}</span>
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {STATIC_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand-teal">
                  <span lang="en" className="font-sans">{item.en}</span>
                  <span lang="bn" className="font-bangla">{item.bn}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-brand-rule/60 bg-brand-cream/40">
        <Container className="flex flex-col gap-2 py-6 text-xs text-brand-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span lang="en" className="font-sans">
              {f.planIbCredit.en}
              <span aria-hidden="true"> · </span>
              {f.capecCredit.en}
            </span>
            <span lang="bn" className="font-bangla">
              {f.planIbCredit.bn}
              <span aria-hidden="true"> · </span>
              {f.capecCredit.bn}
            </span>
          </p>
          <p>
            <span lang="en" className="font-sans">
              {f.lastUpdatedLabel.en}: <time dateTime={BUILD_DATE}>{formatDate(BUILD_DATE, "en")}</time>
            </span>
            <span lang="bn" className="font-bangla">
              {f.lastUpdatedLabel.bn}: <time dateTime={BUILD_DATE}>{formatDate(BUILD_DATE, "bn")}</time>
            </span>
          </p>
        </Container>
        <Container className="pb-6 text-xs text-brand-mute">
          <p>
            <span lang="en" className="font-sans">{f.copyright.en}</span>
            <span lang="bn" className="font-bangla">{f.copyright.bn}</span>
          </p>
        </Container>
      </div>
    </footer>
  );
}
