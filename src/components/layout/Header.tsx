"use client";

import Link from "next/link";
import { useState } from "react";

import { LanguageSwitcher } from "@/components/locale/LanguageSwitcher";
import type { SiteCopy } from "@/lib/types";

import { Container } from "./Container";

type NavItem = { href: string; label: { en: string; bn: string } };

export function Header({ site }: { site: SiteCopy }) {
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    { href: "/", label: site.nav.home },
    { href: "/podcasts", label: site.nav.podcasts },
    { href: "/entrepreneurs", label: site.nav.entrepreneurs },
    { href: "/reels", label: site.nav.reels },
    { href: "/about", label: site.nav.about },
    { href: "/resources", label: site.nav.resources },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-brand-rule/60 bg-brand-cream/95 backdrop-blur supports-[backdrop-filter]:bg-brand-cream/80">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-sans text-lg font-semibold tracking-tight text-brand-teal"
          onClick={() => setOpen(false)}
        >
          V2V Bridge
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-ink/80 transition hover:text-brand-teal focus-visible:text-brand-teal focus-visible:outline-none"
                >
                  <span lang="en" className="font-sans">{item.label.en}</span>
                  <span lang="bn" className="font-bangla">{item.label.bn}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav-mobile"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-brand-rule text-brand-teal md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </Container>

      <nav
        id="primary-nav-mobile"
        aria-label="Primary mobile"
        hidden={!open}
        className="border-t border-brand-rule/60 md:hidden"
      >
        <Container>
          <ul className="flex flex-col gap-1 py-4 text-base">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-2 py-2 text-brand-ink/90 hover:bg-white/60 hover:text-brand-teal"
                  onClick={() => setOpen(false)}
                >
                  <span lang="en" className="font-sans">{item.label.en}</span>
                  <span lang="bn" className="font-bangla">{item.label.bn}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-brand-rule/60 py-4 sm:hidden">
            <LanguageSwitcher />
          </div>
        </Container>
      </nav>
    </header>
  );
}
