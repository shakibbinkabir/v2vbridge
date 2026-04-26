# Changelog

All notable changes to V2V Bridge are documented here.

## v1.0.0 — 2026-04-26

First production-ready build. Six staged builds delivered in parallel
on `stage-N-…` branches, then merged into `integration-v1` for the
final integration pass.

### Stages

1. **Stage 1 — Foundation.** Next.js 15 + TypeScript strict + Tailwind v4
   scaffold with brand tokens, Inter + Hind Siliguri fonts via
   `next/font/google`, static export config, placeholder favicon and
   OG image, ESLint flat config.
2. **Stage 2 — Core system.** TypeScript types + Zod schemas +
   build-time content loaders for entrepreneurs, podcasts, reels, page
   copy, and site copy. UI primitives (Button, Card, BilingualText,
   Hero, Tag, Prose, Section, Container, Header, Footer). Embed
   wrappers (Spotify, Instagram, TikTok, Facebook) with
   IntersectionObserver lazy mounting. Cards (PodcastCard,
   EntrepreneurCard, ReelCard, SectorIcon). Seed content covering 5
   entrepreneurs, 3 podcasts, 6 reels, and all page copy.
3. **Stage 3 — Static pages.** Home (`/`), `/about`, `/safeguarding`,
   `/withdraw`, `/resources`. All bilingual, all sourcing copy from
   `/content/pages/*.json`. Per-page metadata.
4. **Stage 4 — Podcast surface.** `/podcasts` index and
   `/podcasts/[id]` detail with Spotify embed, bilingual summary,
   featured entrepreneur, related reels.
5. **Stage 5 — People surface.** `/entrepreneurs` index,
   `/entrepreneurs/[id]` detail (photo gating on `photoConsent`,
   inline reel embeds, podcast cross-link, About cross-link),
   `/reels` cross-platform masonry gallery.
6. **Stage 6 — Compliance + polish.** `/audit` Plan IB monitoring
   table (`noindex`), `/audit/log.json` machine-readable export,
   `/sitemap.xml`, `/robots.txt`, branded bilingual 404,
   Organization JSON-LD in root layout, importable structured-data
   helpers for per-page schemas. `/dev` verification page removed.

### Stack

- Next.js 15.5.15 (App Router, `output: "export"`)
- React 19.2.5, TypeScript 5.9.3 strict + `noUncheckedIndexedAccess`
- Tailwind CSS 4.2.4 with `@theme` brand tokens
- Zod 4.3.6 for content validation
- Inter + Hind Siliguri via `next/font/google`
- No tracking, no analytics, no cookies, no auth on the public layer

### Quality gates met

- `pnpm typecheck` clean
- `pnpm lint` clean
- `pnpm build` clean — 23 static pages, deployable as-is from `/out`
- Lighthouse Accessibility ≥ 95 and Performance ≥ 85 on every route
  measured during Stage 6 (re-measured in integration on a stable
  cold cache)
- All cross-stage links resolve; no 404 destinations from the nav
- Header and Footer rendered identically on every page (single shared
  layout)

### Known gaps (carried into LAUNCH_CHECKLIST.md)

- Real logo SVG pending — currently `public/logo-placeholder.svg`.
- Real Plan IB Bangladesh focal-point contact pending — `/withdraw`
  carries a visible `TODO: replace with confirmed PIB contact` marker
  in both English and Bangla.
- Production domain pending — sitemap and metadata default to
  `https://www.v2vbridge.org` until `NEXT_PUBLIC_SITE_URL` is set.
- Real Spotify show + episode IDs pending — seed embeds are
  format-valid but resolve to Spotify's "episode not available" UI.
- Real entrepreneur records pending — all five seed records are
  `published: false`. The safeguarding gate emits the branded 404 at
  every unpublished detail URL until content is approved.
- PIB sign-off on public pages, if required.
- `/audit` URL handover to the PIB monitor contact.
