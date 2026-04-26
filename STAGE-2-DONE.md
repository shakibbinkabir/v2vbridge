# Stage 2 — Core System — Done

Branch: `stage-2-core-system`
Build commit: `9c57952` (stage-2: build core system…)
This handoff doc is the next commit on the branch.

## Definition of Done — checked

- [x] All primitives render correctly on `/dev` (in both `pnpm dev` and
      static-export `pnpm build` output)
- [x] Loaders return Zod-validated data; the build **fails** on any bad
      JSON in `/content/`
- [x] Seed content covers all card types: 5 entrepreneurs (varied
      sectors, two with photoConsent), 3 podcasts, 6 reels (across
      Instagram / TikTok / Facebook), 5 page copy files + `site.json`
- [x] `pnpm typecheck`, `pnpm lint`, `pnpm build`, `pnpm dev` — all
      clean. Build emits `/out/index.html`, `/out/dev/index.html`,
      `/out/404.html`, plus `_next/`, favicon.ico, og-default.png, and
      sample-photos/.

## Files added (the API surface for Stages 3–6)

### `src/lib/`

- `types.ts` — interfaces per the Stage 2 spec, plus the small additions
  noted under "Decisions" below: `EmbedProvider`, `ReelPlatform`,
  `PageCopySection`, `SiteCopy`, optional `flags` on `PageCopy`.
- `schemas.ts` — `bilingualStringSchema`, `entrepreneurSchema`,
  `podcastEpisodeSchema`, `reelSchema`, `pageCopySchema`,
  `siteCopySchema`. Each `satisfies z.ZodType<Interface>` so schema and
  interface cannot drift; types are re-exported for convenience.
- `content.ts` — build-time loaders, file-system + Zod, never async:
  - `getAllEntrepreneurs(opts?: { includeUnpublished?: boolean }): Entrepreneur[]`
  - `getEntrepreneur(id): Entrepreneur | null`
  - `getAllPublishedPodcasts(): PodcastEpisode[]` (sorted by
    episodeNumber descending)
  - `getPodcast(id): PodcastEpisode | null`
  - `getAllPublishedReels(): Reel[]`
  - `getReelsByEntrepreneur(id): Reel[]`
  - `getPodcastsByEntrepreneur(id): PodcastEpisode[]`
  - `getPageCopy(slug): PageCopy` (throws if file missing)
  - `getSiteCopy(): SiteCopy` (cached after first read)
  - `_getAllPodcastsRaw()`, `_getAllReelsRaw()` — **internal**, used
    by `/dev` only; do not consume these from public-facing pages.
- `format.ts` — `formatDate(iso, 'en' | 'bn')`, `formatDuration(seconds)`,
  `formatBanglaNumber(n)` (Stage 4's "এপিসোড {n}" use-case).

### `src/components/layout/`

- `Container.tsx` — `max-w-6xl mx-auto px-6` wrapper.
- `Section.tsx` — vertical-spacing wrapper with `tone` prop
  (`cream` | `teal` | `white`), optional `as` and `contained` props.
- `Header.tsx` — sticky top bar, primary nav with desktop links + mobile
  burger menu (vanilla React state, no animation library). Reads nav
  labels from `SiteCopy`.
- `Footer.tsx` — 3-column desktop / stacked mobile, with the required
  `/withdraw` and `/safeguarding` links, the audit link, Plan IB +
  CapeC credits, and a "Last updated" date driven by build time.

### `src/components/ui/`

- `Button.tsx` — variants `primary` | `secondary` | `link`; sizes
  `sm` | `md` | `lg`. Renders `<button>` by default, switches to a
  Next `<Link>` when an `href` prop is provided (the spec called this
  `asChild` — equivalent behaviour, simpler API).
- `Card.tsx` — base card with subtle border, hover lift,
  brand-cream background. Optional `as` prop.
- `BilingualText.tsx` — takes `{ content: BilingualString, as, variant }`.
  Default `stacked` (English block above Bangla block); `side-by-side`
  for short labels. Applies `lang` and the right font family to each
  span. Also exports `isBilingualString` and `bilingualChildren` helpers.
- `Hero.tsx` — title / kicker / intro / actions, with `tone="cream"|"teal"`.
- `Tag.tsx` — pill badge with `coral` (default) / `teal` / `neutral`
  variants.
- `Prose.tsx` — `max-w-prose` wrapper with brand-tuned typography for
  long-form bilingual content; `[&>h2]`, `[&>p]`, etc. styling baked in.

### `src/components/embeds/`

- `EmbedFallback.tsx` — shared fallback card with platform link.
- `LazyMount.tsx` — `"use client"` IntersectionObserver wrapper.
  Renders `fallback` until the element is within `rootMargin` (default
  200px) of the viewport, then mounts `children`.
- `SpotifyEmbed.tsx` — server component, `<iframe loading="lazy">`,
  `noscript` fallback, descriptive `title` for accessibility.
- `InstagramEmbed.tsx`, `TikTokEmbed.tsx`, `FacebookEmbed.tsx` — all
  client components wrapped in `LazyMount`. Each loads the official
  platform script once, idempotently, on first mount. None of them
  pull in any UI library.

### `src/components/content/`

- `SectorIcon.tsx` — abstract SVG fallback used by `EntrepreneurCard`
  whenever `photoConsent !== true` or `photo` is missing. Five sector
  glyphs (tailoring, fish drying, dairy, handicraft, organic farming)
  with a generic fallback path for unknown sectors.
- `PodcastCard.tsx` — episode kicker, bilingual title, sector tag,
  duration, link to `/podcasts/[id]`.
- `EntrepreneurCard.tsx` — photo-or-icon (gated on `photoConsent`),
  display name, sector + district tags, summary excerpt, link to
  `/entrepreneurs/[id]`. Uses Next `<Image>` only when a real photo
  is allowed.
- `ReelCard.tsx` — platform-tinted aspect block with platform badge,
  bilingual caption excerpt. `linkTo` prop chooses
  `entrepreneur` (default) vs `platform`; the secondary "Open on …"
  link always links out to the platform regardless.

### Root layout

`src/app/layout.tsx` is now the production layout — Header + Footer
wrapping a flex column, font variables on `<html>`, default
`metadataBase` + `openGraph` + `icons`, and `lang="en"` (BilingualText
handles the per-block `lang="bn"`).

`src/app/page.tsx` is still the Stage 1 placeholder (Stage 3 replaces
it). It now uses `<section>` instead of `<main>` so the layout's
`<main id="main-content">` wraps it correctly.

### Seed content (`/content/`)

- `entrepreneurs/sample-001.json` … `sample-005.json` — varied sectors,
  all `published: false`. `sample-001` (tailoring) and `sample-003`
  (dairy) have `photoConsent: true` and reference
  `/sample-photos/sample-001.svg` and `/sample-photos/sample-003.svg`
  in `/public/sample-photos/` — abstract SVG placeholders, **not**
  photos of real people.
- `podcasts/sample-ep01.json` … `sample-ep03.json` — three episodes,
  each linked to one entrepreneur, with placeholder Spotify embed IDs.
  See "TODOs for the content team" below.
- `reels/sample-r01.json` … `sample-r06.json` — distributed across
  IG / TikTok / FB, each linked to an entrepreneur.
- `pages/home.json`, `about.json`, `safeguarding.json`,
  `withdraw.json`, `resources.json` — bilingual page copy that Stage 3
  can render unchanged. `withdraw.json` and `safeguarding.json`
  contain the "TODO: replace with confirmed PIB contact" placeholder.
  `resources.json` carries `flags.learningBriefAvailable: false`.
- `pages/site.json` — site-wide bilingual labels (nav, footer, withdraw,
  audit, last-updated, copyright).
- `content/README.md` — non-developer guide for editing these files via
  the GitHub web UI.

### `src/app/dev/page.tsx`

Renders one of every primitive, embed, and card. Used to visually
verify that Stage 2 is internally consistent before Stages 3-6 start.
Spec called this `/_dev`; renamed to `/dev` for the reason in the next
section.

## Decisions you should know about

1. **`/_dev` route renamed to `/dev`.** Next.js App Router treats any
   folder prefixed with `_` as a *private folder* — it is excluded from
   routing. `app/_dev/page.tsx` therefore produces no route. The Stage 6
   "noindex or delete /_dev" task should target `/dev` instead. The
   `_`-prefix convention is documented at
   <https://nextjs.org/docs/app/getting-started/project-structure#private-folders>.

2. **Underscore-prefixed raw loaders.** `_getAllPodcastsRaw()` and
   `_getAllReelsRaw()` exist so `/dev` can render its primitives in
   both dev and production builds (without them, the production build
   of `/dev` would be empty since every seed record is `published: false`
   and the dev fallback only fires when `NODE_ENV === 'development'`).
   These are deliberately scoped to `/dev` and tooling — Stages 3-6
   must consume the public `getAllPublished*` loaders, which keep the
   safeguarding gate intact.

3. **PageCopy gained an optional `flags` map.** The Stage 3 spec
   references a `learningBriefAvailable: boolean` field on
   `resources.json`. Rather than special-casing one slug, the schema
   carries `flags?: Record<string, boolean>`. `resources.json` writes
   it as `"flags": { "learningBriefAvailable": false }`. Stage 3 can
   read `pageCopy.flags?.learningBriefAvailable === true` to decide
   whether to surface the download link.

4. **Photo paths live in `/public`, not `/content`.** The spec called
   for `/content/_sample-photos/*.jpg` references; Next.js cannot serve
   anything from outside `/public` in a static export, so the abstract
   SVG placeholders sit in `/public/sample-photos/sample-001.svg` and
   `…/sample-003.svg`, and the entrepreneur JSON references those
   paths directly. The `content/README.md` note for content editors
   says real photos go in `public/photos/<id>.jpg`.

5. **`Button` uses `href` instead of `asChild`.** The spec wrote
   `asChild` (a Radix-style API). The Stage 2 implementation switches
   to a discriminated-union shape: pass `href` and you get a Next
   `<Link>`, omit it and you get a `<button>`. Same outcome, no extra
   primitive needed, and TypeScript narrows the rest of the props
   correctly.

6. **`BilingualText` uses `as: ElementType`** rather than the spec's
   `as: keyof JSX.IntrinsicElements` because we sometimes want to pass
   a Next component (`<Link>`) as the wrapper. The narrower type is a
   subset of `ElementType`, so existing call sites are unchanged.

7. **`Section` accepts `tone` not `bgColor`** to keep Tailwind's class
   name set deterministic (`cream` | `teal` | `white`). White surfaces
   are useful between cream panels; the spec listed only `cream | teal`,
   we added `white`.

8. **Footer's "Last updated" is build-time `Date()`**. It updates on
   every deploy, which is the cheapest accurate signal we have for a
   static-export site. If a more meaningful "content last updated" is
   wanted later, derive it from the most recent `publishedAt` in
   `/content/*` — easy to do as a future enhancement, but not required
   by Stage 2.

9. **Embed scripts (IG/TikTok/FB) load from third-party CDNs.** The
   official platform embed URLs are baked into the embed components.
   Lighthouse and CSP audits in Stage 6 should be aware of this; if
   the project ever needs to remove third-party requests entirely, the
   embeds become static thumbnail-with-link.

10. **Stage 1 foundation files were not modified.** No changes to
    `next.config.ts`, `tsconfig.json`, the Tailwind setup, or the
    pinned dependency versions of next/react/react-dom/typescript/
    tailwindcss. The single dependency added is **`zod` pinned at
    `4.3.6`**.

## TODOs for the content team

These are **inside the seed JSON** and intentionally visible:

- `content/pages/withdraw.json` and `content/pages/safeguarding.json` —
  the line "TODO: replace with confirmed PIB contact (name, phone,
  email)" appears verbatim. Stage 3 must keep it visible in the
  rendered copy until the real contact is supplied.
- All entrepreneur reviewer fields read `"PLACEHOLDER — YSC reviewer 1"`
  etc. The real reviewer names come in when each record flips to
  `published: true`.
- All Spotify episode IDs in `content/podcasts/sample-ep0*.json` are
  plausibly-formatted but not guaranteed to resolve. Stage 4 builds
  fine regardless (the build never network-hits Spotify); the embeds
  will show Spotify's "episode not available" UI until the production
  episode IDs replace them.
- All reel `embedUrl` values are placeholders pointing at non-existent
  posts. They pass URL validation; the embeds will display fallback
  links until real URLs are filed.

## Stages 3–6 — what you may consume

Direct imports from these paths only:

```
@/components/layout/{Header, Footer, Container, Section}
@/components/ui/{Button, Card, BilingualText, Hero, Tag, Prose}
@/components/embeds/{SpotifyEmbed, InstagramEmbed, TikTokEmbed, FacebookEmbed, EmbedFallback, LazyMount}
@/components/content/{PodcastCard, EntrepreneurCard, ReelCard, SectorIcon}
@/lib/types        — interfaces only
@/lib/schemas      — schemas + re-exported types
@/lib/content      — getAll*, get*, getPageCopy, getSiteCopy
                     (NOT _getAll*Raw — that's /dev-only)
@/lib/format       — formatDate, formatDuration, formatBanglaNumber
```

You should not need to add any new dependency. If a primitive is
missing the prop you need, **stop** — write a note in
`coordination/blockers.md` rather than editing the primitive directly.
That keeps the parallel-agent merges clean.

## Verification recap

```
pnpm install        # 318 packages
pnpm typecheck      # 0 errors
pnpm lint           # 0 issues
pnpm build          # 5 pages, /out/dev/index.html includes Hero,
                    # Buttons, Tags, Card+Prose, all 6 cards, all 4
                    # embed fallbacks (LazyMount-rendered)
pnpm dev            # localhost:3000 home + /dev render with sample
                    # data via the dev fallback path
```

Last commit hash before this handoff doc: `9c57952`.
