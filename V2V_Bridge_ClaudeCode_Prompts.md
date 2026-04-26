# V2V Bridge — Claude Code Prompts (per stage)

Companion to `V2V_Bridge_PRD_Staged_v1.1.md`. Each block below is a complete, self-contained Claude Code initial prompt. Copy the entire fenced block (including the heading line if you want context for the agent) into a new Claude Code session.

---

## How to use this file

```
1. Run Stage 1 prompt in one Claude Code session.
2. Review, merge to main.
3. Run Stage 2 prompt in a fresh session on the updated main.
4. Review, merge to main.
5. Open four terminals; run Stages 3, 4, 5, 6 prompts simultaneously, each
   in its own Claude Code session and its own git worktree or branch.
6. Merge in this order: Stage 3 → 4 → 5 → 6.
7. Run the Integration prompt to catch anything the parallel agents missed.
```

**Tip on running parallel agents:** use `git worktree add ../v2v-stage-3 stage-3-static-pages` for each parallel branch so each agent works on its own checkout. Avoids checkout thrash.

---

## Universal conventions (every agent reads this first)

Every prompt below opens with: *"Before you start, read `CONVENTIONS.md` at the repo root."* Create that file once after Stage 1 with the content below so every subsequent agent has the same baseline.


---

## Stage 1 prompt — Foundation

````
You are building Stage 1 of the V2V Bridge Project Hub. This stage is a
sequential primary dependency — Stages 2 through 6 cannot start until
this is merged.

ROLE
Set up the foundation of a Next.js 15 + TypeScript + Tailwind CSS v4
static-export project with brand tokens, fonts, deploy config, and a
placeholder homepage. Nothing more. Resist the urge to build pages or
components beyond the placeholder; that's Stages 2–5.

REQUIRED READING (in this order)
1. V2V_Bridge_PRD_Staged_v1.1.md — the staged plan
2. V2V_Bridge_PRD_v1.0.docx — full functional PRD (use extract-text or
   read the underlying XML if you can't open it directly)

GIT
Create branch: stage-1-foundation
Commit messages prefixed: "stage-1: ..."

TASKS
1. Initialize a Next.js 15 project at the repo root using:
     pnpm create next-app@latest . --ts --tailwind --app --eslint \
       --src-dir --import-alias "@/*" --no-turbopack
   (If the CLI flags differ in the current version, set the equivalent
   options interactively.)

2. Pin dependency versions in package.json (no ^ ranges on next, react,
   react-dom, typescript, tailwindcss).

3. Configure next.config.ts:
     - output: 'export'
     - images: { unoptimized: true } (required for static export)
     - trailingSlash: true (clean URLs on static hosts)
     - experimental: leave default

4. Configure tsconfig.json with strict: true and noUncheckedIndexedAccess: true.

5. Configure Tailwind v4 in src/app/globals.css using the @theme directive
   to define brand tokens. The brand tokens MUST appear as both CSS custom
   properties on :root AND as Tailwind theme values, so utilities like
   bg-brand-teal, text-brand-coral, font-bangla, font-display work
   throughout the app.

   Token names (use exactly these in Tailwind):
     colors: brand-teal, brand-coral, brand-cream, brand-ink, brand-mute,
             brand-rule
     fontFamily: bangla, sans (sans = Inter, bangla = Hind Siliguri)

6. Wire up next/font/google in src/app/layout.tsx for Inter and
   Hind Siliguri. Bind to CSS variables --font-sans and --font-bangla.
   Reference these variables in the Tailwind theme so the fontFamily
   utilities resolve correctly.

7. In src/app/globals.css set:
     html { scroll-behavior: smooth; }
     body { background: var(--color-brand-cream); color: var(--color-brand-ink); }
   No SkipLink, no @import for Lenis.

8. Build a minimal layout.tsx — just <html><body>{children}</body></html>
   with the font variables applied to <html>. Stage 2 fleshes this out.

9. Replace src/app/page.tsx with a placeholder that renders:
     - <h1> "V2V Bridge" in Inter, brand-teal, large
     - <p>"ভয়েস টু ভেঞ্চার ব্রিজ" in Hind Siliguri, brand-mute, smaller
     - A short tagline in both languages
   Use Tailwind utilities only. Center it on the page.

10. Add to /public:
      - logo-placeholder.svg: a simple textual "V2V" mark in brand-teal
        on transparent background, square viewBox 0 0 100 100. Inline SVG.
        This is replaced with the real logo before deploy.
      - favicon.ico: 32×32 derived from the placeholder
      - og-default.png: 1200×630, brand-teal background, white "V2V Bridge"
        text. Generate with a single SVG-to-PNG step or by writing a tiny
        Node script — do not pull in headless browsers.

11. Add CONVENTIONS.md at repo root using the content from the prompts
    file (verbatim — copy from V2V_Bridge_ClaudeCode_Prompts.md §
    "Universal conventions").

12. Add coordination/blockers.md with one line: "Empty. Parallel agents
    use this to flag cross-stage blockers."

13. Add a README.md with:
      - Project name and 1-paragraph description
      - "pnpm install / pnpm dev / pnpm build" instructions
      - Link to the PRDs
      - Stack summary
      - Section "How to publish content" — explains GitHub web UI editing
        of files in /content/

14. Add .gitignore (Next.js default + .env.local + coordination/*.local.md).

15. Add a vercel.json only if needed for the static export config.

16. Verify:
      pnpm install
      pnpm typecheck   # add this script to package.json
      pnpm lint
      pnpm build
      pnpm dev          # smoke test, visit localhost:3000
    All four commands must succeed clean. The dev server must show the
    placeholder homepage with both fonts rendering correctly.

17. Write STAGE-1-DONE.md with:
      - File tree summary
      - Exact dep versions
      - Anything you encountered that Stage 2 should know
      - Commit hash of last commit on this branch

DEFINITION OF DONE
- pnpm build produces a static /out directory
- Visiting localhost:3000 shows "V2V Bridge" + Bangla equivalent in the
  correct fonts on a cream background
- All 4 verification commands clean
- STAGE-1-DONE.md committed
- Branch pushed: git push origin stage-1-foundation

DO NOT
- Build any pages beyond the placeholder homepage
- Create any components in src/components/
- Add any content in /content/ — that's Stage 2
- Add Storybook, Husky, lint-staged, Sentry, or any other tooling not
  listed
- Add Lenis, SkipLink, dark mode, or i18n routing
- Use Pages Router — App Router only
- Use server components for the placeholder; just plain TSX is fine

STOP CONDITIONS
- If pnpm is not installed and cannot be installed, fall back to npm
  and document this in STAGE-1-DONE.md.
- If any locked stack choice causes a hard error, stop and ask. Do not
  silently substitute.
````

---

## Stage 2 prompt — Core System

````
You are building Stage 2 of the V2V Bridge Project Hub. This stage is a
sequential primary dependency. After this merges, Stages 3–6 run in
parallel and consume what you build here.

ROLE
Build every shared primitive, type, schema, content loader, embed
component, and content card that the parallel stages will need. Plus
seed content so the parallel stages have something to render in dev.
This is the "API surface" for the rest of the project.

REQUIRED READING
1. CONVENTIONS.md at repo root
2. V2V_Bridge_PRD_Staged_v1.1.md (especially §4 Stage 2 deliverables and
   §3 Directory ownership)
3. V2V_Bridge_PRD_v1.0.docx (sections 4 Functional Requirements,
   6 Content Types & Data Model, 9 Safeguarding)
4. STAGE-1-DONE.md

GIT
Branch: stage-2-core-system, branched from main after Stage 1 merged.
Commit prefix: "stage-2: ..."

TASKS

A. TYPES AND SCHEMAS

Create src/lib/types.ts with these interfaces:

  type BilingualString = { en: string; bn: string };

  interface Entrepreneur {
    id: string;                          // e.g., "ent-001"
    displayName: string;                 // first name only or pseudonym
    sector: string;                      // e.g., "tailoring"
    district: string;                    // "Satkhira" only — no thana
    photo?: string;                      // path under /public if photoConsent
    photoConsent: boolean;
    summary: BilingualString;            // ≤300 words each
    podcastId?: string;                  // links to PodcastEpisode
    reelIds: string[];                   // links to Reels
    consentFormFilename: string;         // e.g., "ent-001_consent.pdf"
    publishedAt?: string;                // ISO date
    published: boolean;
    reviewers: { ysc1: string; ysc2: string; projectLead: string };
  }

  interface PodcastEpisode {
    id: string;
    episodeNumber: number;
    title: BilingualString;
    summary: BilingualString;
    embed: { provider: 'spotify' | 'anchor' | 'youtube'; embedId: string };
    durationSeconds: number;
    recordedOn: string;       // ISO date
    publishedAt?: string;
    published: boolean;
    entrepreneurId: string;
    transcriptUrl?: string;
  }

  interface Reel {
    id: string;
    platform: 'instagram' | 'tiktok' | 'facebook';
    embedUrl: string;
    caption: BilingualString;
    entrepreneurId: string;
    podcastId?: string;
    publishedAt?: string;
    published: boolean;
  }

  interface PageCopy {
    slug: string;            // 'home' | 'about' | 'safeguarding' | etc.
    title: BilingualString;
    sections: Array<{
      heading?: BilingualString;
      body: BilingualString;
    }>;
    metadata: {
      title: string;          // English, for SEO
      description: string;    // English, for SEO
    };
  }

Create src/lib/schemas.ts with Zod schemas matching the above. Export
both the schema and the inferred type so consumers can use either.

B. CONTENT LOADERS

Create src/lib/content.ts with build-time loaders:

  - getAllEntrepreneurs(opts?: { includeUnpublished?: boolean }): Entrepreneur[]
  - getEntrepreneur(id: string): Entrepreneur | null
  - getAllPublishedPodcasts(): PodcastEpisode[]
  - getPodcast(id: string): PodcastEpisode | null
  - getAllPublishedReels(): Reel[]
  - getReelsByEntrepreneur(id: string): Reel[]
  - getPodcastsByEntrepreneur(id: string): PodcastEpisode[]
  - getPageCopy(slug: string): PageCopy

Loaders read from /content/ at build time, validate with Zod, throw
clearly if validation fails (these errors should fail the build, never
silently render bad data). Use fs.readFileSync + path.join — no async
needed since this runs at build time only.

In dev mode, getAllEntrepreneurs() default behavior: if no published
records exist AND env NODE_ENV === 'development', also return
unpublished sample records. This lets parallel agents see something
during dev. In production builds, only published: true records render.

Create src/lib/format.ts with:
  - formatDate(iso: string, locale: 'en' | 'bn'): string
  - formatDuration(seconds: number): string  // "4:32"

C. LAYOUT PRIMITIVES (src/components/layout/)

  - Header.tsx: site nav with links to Home, Podcasts, Entrepreneurs,
    Reels, About, Resources. Mobile burger menu toggle. Uses
    Tailwind only, no JS animation library.
  - Footer.tsx: 3-column on desktop (About / Listen / Project info).
    Footer must include a link to /withdraw with the label "Withdraw or
    change consent" and a link to /safeguarding. Plan IB credit text.
    "Last updated: <date>" text driven by build time. Copyright line.
  - Container.tsx: max-w-6xl mx-auto px-6
  - Section.tsx: vertical spacing wrapper, optional background color
    prop (cream | teal | white)

D. UI PRIMITIVES (src/components/ui/)

  - Button.tsx: variants 'primary' | 'secondary' | 'link', sizes 'sm' |
    'md' | 'lg', as button or as Link via asChild prop
  - Card.tsx: base card with subtle border, hover lift, brand-cream
    background
  - BilingualText.tsx: takes { content: BilingualString, as?: keyof
    JSX.IntrinsicElements }, renders English and Bangla with
    appropriate fonts. Default layout: stacked (English on top, Bangla
    below). Optional 'side-by-side' variant for short labels.
    Internally applies font-sans to en, font-bangla to bn. Includes
    lang attributes for accessibility.
  - Hero.tsx: page hero block with title (BilingualString), kicker
    (optional BilingualString), and optional CTA buttons
  - Tag.tsx: rounded pill, brand-coral text on cream, for sector and
    district labels
  - Prose.tsx: max-w-prose wrapper with appropriate vertical rhythm for
    long-form bilingual content

E. EMBEDS (src/components/embeds/)

All embeds must be lazy-loaded. For Spotify and YouTube use iframe with
loading="lazy". For Instagram/TikTok/Facebook use their official embed
script approach but isolate it so it doesn't run until user scrolls
near it (use IntersectionObserver-based lazy mount in a "use client"
wrapper). Each embed has a fallback display showing a placeholder + a
"Listen on <platform>" link in case JS fails or embeds block.

  - SpotifyEmbed.tsx: takes embedId (the part after /episode/)
  - InstagramEmbed.tsx: takes embedUrl
  - TikTokEmbed.tsx: takes embedUrl
  - FacebookEmbed.tsx: takes embedUrl

F. CONTENT CARDS (src/components/content/)

  - PodcastCard.tsx: shows episode number, bilingual title, sector tag,
    duration, link to /podcasts/[id]
  - EntrepreneurCard.tsx: shows photo (only if photoConsent === true,
    else a sector icon SVG fallback), display name, sector + district
    tags, 1-line summary excerpt, link to /entrepreneurs/[id]
  - ReelCard.tsx: thumbnail or platform-color-block, platform badge,
    bilingual caption excerpt, link out to platform OR to entrepreneur
    page (configurable via prop)

G. ROOT LAYOUT

Update src/app/layout.tsx to:
  - Wrap children in <Header /> and <Footer />
  - Apply font variables to <html>
  - Set default metadata: title "V2V Bridge — Voice to Venture",
    description (English, 1 sentence), OG image pointing to
    /og-default.png
  - Add lang="en" on <html> and let BilingualText handle Bangla blocks

H. SEED CONTENT (in /content/)

Create exactly:
  - 5 entrepreneur sample records (sample-001 through sample-005),
    all with published: false, varied sectors:
    tailoring, fish drying, dairy, handicraft, organic farming.
    Each with realistic-feeling but clearly placeholder bilingual
    summaries (~150 words each). Two records have photoConsent: true
    with reference to non-existent /content/_sample-photos/*.jpg
    (Stage 2 also creates 2 simple SVG placeholder "photos" so the
    references resolve and the build succeeds).
  - 3 podcast sample records (sample-ep01 through sample-ep03), each
    linked to one of the entrepreneurs, with a real public Spotify
    episode embedId used as a placeholder (use a well-known podcast
    episode — anything that won't 404).
  - 6 reel sample records, distributed across IG/TikTok/FB, linked to
    entrepreneurs, with embedUrls that point to publicly accessible
    posts (use safe placeholder URLs that won't break the build).
  - 5 page copy files: home.json, about.json, safeguarding.json,
    withdraw.json, resources.json. Each must have realistic bilingual
    body content (~3-5 sections each), suitable for Stage 3 to render
    with no further editing. The /withdraw copy must reference a
    placeholder Plan IB Bangladesh contact — leave a clearly marked
    "TODO: replace with confirmed PIB contact" inline.
  - One additional file content/pages/site.json with site-wide bilingual
    strings: nav labels, footer text, "withdraw consent" link label,
    last-updated label.

Add a content/README.md explaining the schema and how to add a real
record (target audience: a non-developer using GitHub web UI).

I. DEV-ONLY VERIFICATION PAGE

Create src/app/_dev/page.tsx (a route at /_dev, gitignored at deploy
via robots if needed but kept in source for now — Stage 6 may remove
or noindex it). The page renders one of each card (PodcastCard,
EntrepreneurCard, ReelCard), one of each embed, one BilingualText
example, one Button of each variant, one Hero. Used to visually
verify primitives.

J. VERIFICATION

  pnpm typecheck    # must be clean
  pnpm build        # must succeed; output dir /out
  pnpm dev          # smoke test
  Visit /_dev       # all primitives render
  Visit /           # placeholder still works (Stage 3 replaces this)

K. HANDOFF

Write STAGE-2-DONE.md with:
  - List of every component, type, schema, loader, page-copy file
  - Explicit list of "API surface" Stages 3–6 may use
  - Any decisions you made about ambiguous spec items
  - Any TODOs left for the content team
  - Commit hash of last commit

DEFINITION OF DONE
- All primitives render correctly on /_dev
- Loaders return validated data; build fails on bad data
- Seed content covers all card types
- Stages 3–6 should be able to start without asking you any questions

DO NOT
- Build any user-facing pages other than /_dev (those are Stage 3+)
- Modify Stage 1's foundation files (next.config, tsconfig, tailwind
  config) unless absolutely required — flag in STAGE-2-DONE.md if you do
- Add any new dependencies without justification (and add them to
  package.json with exact pinned versions)
- Use client-side data fetching anywhere — content is build-time only
- Sample photos must NOT depict real people; use abstract SVG icons
````

---

## Stage 3 prompt — Static Pages (Parallel Agent A)

````
You are Parallel Agent A working on Stage 3 of the V2V Bridge Project
Hub. Stages 4, 5, 6 are running simultaneously in other Claude Code
sessions on other branches. You must respect directory ownership and
never modify files outside your assigned scope.

ROLE
Build five static content pages: Home, About, Safeguarding, Withdraw,
Resources. Each page reads its content from /content/pages/<slug>.json
and renders it using Stage 2 primitives.

REQUIRED READING
1. CONVENTIONS.md
2. V2V_Bridge_PRD_Staged_v1.1.md §3 (your owned files), §4 (Stage 3)
3. STAGE-1-DONE.md, STAGE-2-DONE.md
4. Skim the existing src/components/ (especially ui/Hero, ui/Prose,
   ui/BilingualText, layout/Section, layout/Container) so you know
   the API surface
5. /content/pages/*.json so you know what copy you're rendering

GIT
Branch: stage-3-static-pages, branched from main after Stage 2 merged.
Commit prefix: "stage-3: ..."

YOUR FILES (own these)
  src/app/page.tsx                    (replaces Stage 1 placeholder)
  src/app/about/page.tsx
  src/app/safeguarding/page.tsx
  src/app/withdraw/page.tsx
  src/app/resources/page.tsx
  public/og/static-pages-*.png        (one OG image per page if you generate them; otherwise rely on the default from layout.tsx)

OFF LIMITS — do not modify
  Anything in src/components/
  Anything in src/lib/
  Anything in /content/
  src/app/layout.tsx
  Any other src/app/*/page.tsx (those belong to Stages 4, 5, 6)
  next.config.ts, tsconfig.json, tailwind.config.ts

If you genuinely need to modify any of the above, STOP. Append a note
to coordination/blockers.md with what you need and why, then complete
whatever else you can. The user will resolve and rebase before merge.

TASKS

1. HOME (src/app/page.tsx)
   - Hero: title from home.json, kicker, two CTAs ("Listen to the
     stories" → /podcasts, "About the project" → /about)
   - "Latest podcasts" section: getAllPublishedPodcasts().slice(0, 3),
     rendered with PodcastCard. Heading "Latest stories /
     সর্বশেষ গল্প" via BilingualText
   - "Latest reels" section: getAllPublishedReels().slice(0, 6) in a
     responsive grid using ReelCard
   - "About" teaser: short pitch from home.json, link to /about
   - Empty states: if 0 published podcasts, show a "Coming May–June 2026
     / আসছে মে–জুন ২০২৬" message instead of an empty grid

2. ABOUT (/about)
   - Render about.json: title hero, then iterate over sections array
     with BilingualText
   - At the end, a credit block: Plan IB, CapeC., Youth Equality Award.
     Use real text, not placeholders

3. SAFEGUARDING (/safeguarding)
   - Public-facing summary of how minors and entrepreneurs are
     protected on this site. Render safeguarding.json sections.
   - End with a "Report a concern" callout pointing to the same Plan IB
     contact as /withdraw (use the same source — the placeholder TODO
     note in safeguarding.json)

4. WITHDRAW (/withdraw)
   - Render withdraw.json sections — title, plain-language explanation
     of withdrawal rights, contact details (currently TODO placeholder),
     reminder that already-distributed content cannot be recovered
   - Add a noindex/nofollow header just for this page? NO — leave it
     indexable. Stage 6 handles audit-only noindex.

5. RESOURCES (/resources)
   - Render resources.json sections
   - Add an empty-state for the "Final learning brief" download
     ("Available June 2026 / জুন ২০২৬-এ উপলব্ধ"). When the brief PDF
     is ready, the content team will add /public/learning-brief.pdf and
     the link will activate. Read from a flag in resources.json:
     learningBriefAvailable: boolean.

6. PER-PAGE METADATA
   Every page must export `metadata` from page.tsx:
     export const metadata = {
       title: pageCopy.metadata.title + ' | V2V Bridge',
       description: pageCopy.metadata.description,
     };
   Use the metadata from each pageCopy file.

7. ACCESSIBILITY
   - All headings in correct hierarchy (only one h1 per page)
   - Lang attributes correct on Bangla blocks (handled by BilingualText)
   - All interactive elements keyboard-reachable
   - Color contrast: brand-teal on brand-cream and brand-ink on
     brand-cream both pass WCAG AA — confirm visually

8. RESPONSIVE
   Test at 360px (small Android), 768px, 1280px. All layouts must work
   without horizontal scrolling.

VERIFICATION
  pnpm typecheck   # clean
  pnpm build       # succeeds
  pnpm dev         # all 5 routes render
  Visit each route and confirm:
    - Bilingual content renders in correct fonts
    - No hydration warnings in console
    - Layouts work at 360px and 1280px

DEFINITION OF DONE
- All 5 pages render real content (not placeholders) read from
  /content/pages/
- Each has its own metadata export
- pnpm build succeeds
- STAGE-3-DONE.md committed listing files created and any blockers
  raised

DO NOT
- Add new components to src/components/ — use what Stage 2 made
- Modify Stage 2 primitives — use them via their props
- Hardcode any user-facing text — all copy comes from JSON
- Add Stage 4, 5, or 6 routes accidentally
- Delete /_dev — leave it for now; Stage 6 handles cleanup
````

---

## Stage 4 prompt — Podcast Surface (Parallel Agent B)

````
You are Parallel Agent B working on Stage 4 of the V2V Bridge Project
Hub. Stages 3, 5, 6 are running simultaneously. Respect directory
ownership.

ROLE
Build the podcast surface: an index page listing all published
episodes, and a detail page per episode with the embedded Spotify
player.

REQUIRED READING
1. CONVENTIONS.md
2. V2V_Bridge_PRD_Staged_v1.1.md §4 Stage 4
3. STAGE-1-DONE.md, STAGE-2-DONE.md
4. src/components/embeds/SpotifyEmbed.tsx (your primary embed)
5. src/components/content/PodcastCard.tsx
6. src/lib/content.ts loaders for podcasts

GIT
Branch: stage-4-podcast-surface
Commit prefix: "stage-4: ..."

YOUR FILES
  src/app/podcasts/page.tsx
  src/app/podcasts/[id]/page.tsx
  public/og/podcasts.png    (optional — OG image for podcast routes)

OFF LIMITS — do not modify
  Stage 2 components and lib
  Other stages' page directories (about, safeguarding, withdraw,
  resources, entrepreneurs, reels, audit)
  Foundation files

TASKS

1. INDEX (/podcasts/page.tsx)
   - getAllPublishedPodcasts()
   - Render as a responsive grid of PodcastCard, sorted by
     episodeNumber descending (newest first) — confirm sort order with
     content.ts maintainers; if loaders sort already, do not re-sort
   - Empty state when 0 episodes: "Episodes publishing May–June 2026 /
     এপিসোডগুলি মে–জুন ২০২৬-এ প্রকাশ হবে"
   - Page metadata: title "Podcasts | V2V Bridge", description in English

2. DETAIL (/podcasts/[id]/page.tsx)
   - Use generateStaticParams() to pre-render every published episode:
       export async function generateStaticParams() {
         return getAllPublishedPodcasts().map(p => ({ id: p.id }));
       }
   - In the page itself, getPodcast(params.id) — if null or
     published === false, call notFound() (next/navigation)
   - Layout:
       - Episode kicker: "Episode {n} / এপিসোড {n}" (numeral in Bangla)
       - Bilingual title via BilingualText
       - Embedded SpotifyEmbed
       - Bilingual summary in a Prose wrapper
       - "Featured entrepreneur" sidebar/section: if the entrepreneur
         is published, link to /entrepreneurs/[entrepreneurId] with a
         small EntrepreneurCard. If the entrepreneur is unpublished,
         show display name only, no link.
       - "Related reels": getReelsByEntrepreneur(p.entrepreneurId)
         filtered by published; render up to 4 ReelCards
       - Recorded date and duration in the metadata strip
   - Page metadata:
       title: `${p.title.en} | V2V Bridge Podcast`
       description: `${p.summary.en.slice(0, 160)}…`

3. ACCESSIBILITY
   - SpotifyEmbed must have descriptive title attribute on its iframe
   - Numeric episode numbers also presented in Bangla numerals
     (Bangla: ১, ২, ৩…) — implement using a tiny utility in this stage
     that wraps Number.toLocaleString('bn-BD')

4. ERROR HANDLING
   - If getPodcast returns null → notFound()
   - If a podcast has an unpublished entrepreneurId → still render the
     episode, just don't link to the entrepreneur

VERIFICATION
  pnpm typecheck
  pnpm build       # generateStaticParams must work; build outputs all
                   # episode pages
  pnpm dev
  Visit /podcasts  # see grid
  Visit /podcasts/sample-ep01  # see detail with player

DEFINITION OF DONE
- Index renders all published episodes in correct order
- Each detail page is statically generated and renders the player +
  bilingual content + cross-links
- pnpm build succeeds and produces /out/podcasts/sample-ep01/index.html
  for each episode
- STAGE-4-DONE.md committed

DO NOT
- Self-host audio files
- Add a global player or persistent audio bar (out of scope for v1)
- Modify SpotifyEmbed or PodcastCard — use them as-is. If a prop is
  missing, raise a blocker
- Add comment / share / follow buttons (out of scope)
- Add infinite scroll or pagination — even 10 episodes fit on one page
````

---

## Stage 5 prompt — People Surface (Parallel Agent C)

````
You are Parallel Agent C working on Stage 5 of the V2V Bridge Project
Hub. Stages 3, 4, 6 are running simultaneously. Respect directory
ownership.

ROLE
Build the people-and-stories surface: an entrepreneurs index, an
entrepreneur detail page (the project's emotional center), and the
reels gallery.

REQUIRED READING
1. CONVENTIONS.md
2. V2V_Bridge_PRD_Staged_v1.1.md §4 Stage 5
3. STAGE-1-DONE.md, STAGE-2-DONE.md
4. src/components/content/EntrepreneurCard.tsx, ReelCard.tsx
5. src/components/embeds/* (especially InstagramEmbed, TikTokEmbed,
   FacebookEmbed)
6. The Safeguarding section of the docx PRD — "no minor faces" and
   "photoConsent gating" rules apply to your work

GIT
Branch: stage-5-people-surface
Commit prefix: "stage-5: ..."

YOUR FILES
  src/app/entrepreneurs/page.tsx
  src/app/entrepreneurs/[id]/page.tsx
  src/app/reels/page.tsx
  public/og/entrepreneurs.png   (optional)
  public/og/reels.png           (optional)

OFF LIMITS — do not modify
  Stage 2 components and lib
  Other stages' page directories
  Foundation files

TASKS

1. ENTREPRENEURS INDEX (/entrepreneurs/page.tsx)
   - getAllEntrepreneurs() filtered to published: true
   - Render in a responsive grid of EntrepreneurCard
   - Order: by publishedAt descending; if absent, by id ascending
   - Filter UI is OUT OF SCOPE for v1. Just a flat grid.
   - Empty state: "Stories publishing May–June 2026 / গল্পগুলি
     মে–জুন ২০২৬-এ প্রকাশ হবে"

2. ENTREPRENEUR DETAIL (/entrepreneurs/[id]/page.tsx)
   - generateStaticParams() over published entrepreneurs
   - getEntrepreneur(params.id) → notFound() if null or
     published === false
   - Layout:
       - Hero: photo if photoConsent === true and photo path resolves;
         else a sector-icon SVG backdrop in brand-coral on brand-cream.
         NEVER fallback to a generic stock photo.
       - Display name as h1, sector + district tags
       - Bilingual summary in Prose wrapper
       - "Listen to her story" section: if podcastId present and that
         podcast is published, render the SpotifyEmbed inline, plus
         a link to /podcasts/[podcastId]. If podcast is unpublished,
         show "Story coming soon / শীঘ্রই আসছে"
       - "Watch the reels" section: getReelsByEntrepreneur(id) filtered
         by published; render as a 2-column grid of embedded reels
         (use IGEmbed/TikTokEmbed/FBEmbed by reel.platform). If 0
         reels, hide the section entirely
       - Closing block: short "About V2V Bridge" pitch with link to
         /about
   - Page metadata:
       title: `${e.displayName} | V2V Bridge`
       description: `${e.summary.en.slice(0, 160)}…`

3. REELS GALLERY (/reels/page.tsx)
   - getAllPublishedReels()
   - Responsive masonry-ish grid (use CSS columns or grid with auto rows;
     do not pull in a masonry library). Each reel uses ReelCard.
     Click-through goes to the linked entrepreneur, not to the platform
     — the platform link is a small badge in the corner.
   - Empty state: "Reels publishing May–June 2026 / রিলগুলি মে–জুন
     ২০২৬-এ প্রকাশ হবে"
   - Page metadata: title "Reels | V2V Bridge"

4. SAFEGUARDING ENFORCEMENT
   For every photo render in your pages:
     IF entrepreneur.photoConsent !== true OR entrepreneur.photo is missing
     THEN render the sector-icon SVG fallback. Never the photo.
   This rule is enforced inside EntrepreneurCard already, but you
   re-verify it for the detail page hero.

   For ALL reel embeds: do not surface comment threads, follower counts,
   or any UI that pulls user PII from the source platform. The embed
   wrapper from Stage 2 should already handle this; if it doesn't,
   raise a blocker.

5. CROSS-LINKING
   - Entrepreneur page → linked podcast (if published)
   - Entrepreneur page → all linked reels
   - Reels gallery → entrepreneur (not platform) by default

VERIFICATION
  pnpm typecheck
  pnpm build       # static params resolve for all published entrepreneurs
  pnpm dev
  Visit /entrepreneurs, /entrepreneurs/sample-001, /reels

DEFINITION OF DONE
- Entrepreneur index, detail, and reels gallery all render real content
- Photo gating works: entrepreneurs without consent show no face
- Cross-links work in both directions (podcast ↔ entrepreneur)
- pnpm build succeeds
- STAGE-5-DONE.md committed

DO NOT
- Add filter or sort UI — flat lists are fine for v1
- Add real names, contact details, or location data below district
- Add maps, geolocation, or any feature that surfaces precise location
- Add a "follow" or "subscribe" widget for the social platforms
- Add any minor's face or name. The 10 adolescent participants are not
  individually surfaced anywhere — they appear collectively as "Youth
  Steering Committee" only on /about (Stage 3's job, not yours)
````

---

## Stage 6 prompt — Compliance & Polish (Parallel Agent D)

````
You are Parallel Agent D working on Stage 6 of the V2V Bridge Project
Hub. Stages 3, 4, 5 are running simultaneously. Your work is the
cross-cutting polish: audit page, sitemap, robots, structured data,
accessibility audit, Lighthouse pass.

ROLE
Build the project's compliance surface (the /audit page used by Plan
IB), the SEO surface (sitemap, robots, structured data), the 404 page,
and run an accessibility/performance audit pass with fixes.

REQUIRED READING
1. CONVENTIONS.md
2. V2V_Bridge_PRD_Staged_v1.1.md §4 Stage 6
3. V2V_Bridge_PRD_v1.0.docx §3 (PIB audit role) and §9 (Safeguarding)
4. STAGE-1-DONE.md, STAGE-2-DONE.md

GIT
Branch: stage-6-compliance-polish
Commit prefix: "stage-6: ..."

YOUR FILES
  src/app/audit/page.tsx
  src/app/sitemap.ts
  src/app/robots.ts
  src/app/not-found.tsx
  src/lib/structured-data.ts   (helper for JSON-LD)
  public/og/audit.png          (optional)

OFF LIMITS
  Stage 3, 4, 5 page directories — they each handle their own per-page
  metadata exports. You only handle site-wide concerns.
  Stage 2 primitives — use them.
  /content/ — read only.

NOTE ON TIMING
You are running in parallel with Stages 3, 4, 5. They are creating new
pages on their own branches. Your sitemap.ts must read from /content/
loaders to discover all published items — this works regardless of
which pages have been built, because the sitemap is data-driven, not
file-system-driven.

TASKS

1. AUDIT PAGE (/audit/page.tsx)
   - This page is for Plan IB monitors. URL is shareable but unlisted
     and noindexed.
   - Render a table with one row per published item across all content
     types (podcasts, entrepreneurs, reels). Columns:
       - Item ID
       - Type (Podcast / Entrepreneur / Reel)
       - Title or display name (English only — this is an internal
         audit surface)
       - Published date
       - YSC Reviewer 1 (entrepreneurs only)
       - YSC Reviewer 2 (entrepreneurs only)
       - Project Lead signoff (entrepreneurs only)
       - Consent form filename (entrepreneurs only)
   - Above the table, show summary stats: total items, total by type,
     count without consent forms (should be 0 — flag in red if not)
   - Set page metadata to noindex:
       export const metadata = {
         title: 'V2V Bridge Audit',
         robots: { index: false, follow: false },
       };
   - Add a clear "Internal — for Plan International Bangladesh
     monitors only" banner at the top in brand-coral
   - Style: simple, dense, table-first. This is not a marketing page.

2. SITEMAP (src/app/sitemap.ts)
   Use Next.js sitemap convention:
     export default function sitemap(): MetadataRoute.Sitemap {
       const base = 'https://www.v2vbridge.org'; // TODO env var
       const staticRoutes = ['', '/about', '/safeguarding', '/withdraw',
         '/resources', '/podcasts', '/entrepreneurs', '/reels'];
       const dynamicPodcasts = getAllPublishedPodcasts().map(p => ({
         url: `${base}/podcasts/${p.id}`, lastModified: p.publishedAt
       }));
       // similar for entrepreneurs
       return [...staticRoutes.map(r => ({ url: `${base}${r}` })),
               ...dynamicPodcasts, ...dynamicEntrepreneurs];
     }
   Read base URL from process.env.NEXT_PUBLIC_SITE_URL with the .org as
   fallback, so domain decision (still pending) doesn't block the
   build.

3. ROBOTS (src/app/robots.ts)
   - Allow: '*' for all bots
   - Disallow: '/audit', '/_dev'
   - Sitemap: '<base>/sitemap.xml'

4. 404 (src/app/not-found.tsx)
   - Branded — uses Hero primitive
   - Bilingual "Page not found / পৃষ্ঠা পাওয়া যায়নি"
   - Link back to home and to /podcasts

5. STRUCTURED DATA (src/lib/structured-data.ts)
   - Helper builders that return JSON-LD objects:
       organizationLD()    → schema.org Organization for site-wide
       podcastSeriesLD()   → for /podcasts
       podcastEpisodeLD(p) → for /podcasts/[id]
       articleLD(e)        → for /entrepreneurs/[id]
   - These are exported for Stages 3–5 to consume IF they have already
     merged. If they haven't yet merged when you finish, that's fine —
     leave the helpers ready and document in STAGE-6-DONE.md that the
     other pages should import these in their own metadata or via
     <script type="application/ld+json"> in their layouts.
   - Inject organizationLD into root layout via metadata.other or a
     server-rendered <script> tag.

6. ACCESSIBILITY PASS
   Run an audit on every available route (use Playwright + axe if you
   can install them locally; otherwise eslint-plugin-jsx-a11y is the
   minimum bar). Fix every issue or document why it's a non-issue.
   Common things to check:
     - Each page has exactly one h1
     - All images have alt text (or aria-hidden if decorative)
     - All links have discernible text
     - Color contrast passes WCAG AA
     - Keyboard focus visible on all interactive elements

7. PERFORMANCE PASS
   Build the static export, serve it locally, and run Lighthouse mobile
   on each route:
     pnpm build
     npx serve out -l 3000
     npx lighthouse http://localhost:3000 \
        --form-factor=mobile --only-categories=performance,accessibility \
        --output=html --output-path=./lighthouse/<route>.html
   Targets:
     Performance ≥ 85
     Accessibility ≥ 95
   For any route that misses targets, fix and re-run. If a target is
   genuinely unachievable (e.g., third-party embeds drag performance
   below 85), document the cause and the lowest stable score reached
   in STAGE-6-DONE.md.

8. /_dev CLEANUP
   The /_dev page from Stage 2 must be either deleted or noindex'd.
   Recommendation: delete it. If you're cautious, set its metadata to
   robots: noindex and add it to robots.ts disallow.

9. CONTENT REVIEW LOG STUB
   Add /audit/log.json route as a static JSON file (not a page) that
   exposes the audit data as machine-readable JSON for Plan IB tooling.
   Shape: array of audit rows. Generate at build time from /content/.
   Achieve via app/audit/log.json/route.ts with a static GET handler —
   confirm static export is happy with this; if not, write the file
   directly to /public/audit-log.json from a small build-time script.

VERIFICATION
  pnpm typecheck
  pnpm build
  pnpm dev
  Visit /audit, /sitemap.xml, /robots.txt, /404, a deliberately bad URL
  npx lighthouse on each route at the targets above

DEFINITION OF DONE
- /audit page renders a complete table of every published item
- sitemap.xml resolves at build time, includes all public routes and
  dynamic items
- robots.txt resolves and excludes /audit
- 404 page is branded
- Structured data validates at https://validator.schema.org
- Lighthouse targets met on every route, or deviations documented
- /_dev removed or noindex'd
- STAGE-6-DONE.md committed with Lighthouse score table

DO NOT
- Modify Stage 3, 4, 5 page files
- Add Google Analytics, Tag Manager, Facebook Pixel, Hotjar, or any
  third-party tracking. The PRD's privacy clause forbids this.
- Add a cookie banner — there are no cookies to disclose
- Add a sitemap to robots.txt that points to a different host
````

---

## Integration prompt — Final pass after all parallel branches merge

````
You are running the final integration pass on the V2V Bridge Project
Hub. Stages 1–6 have all merged to main. Your job is to catch what the
parallel agents could not see in isolation: cross-stage smoke tests,
inconsistencies, and one final readiness check before the 15 May 2026
launch.

REQUIRED READING
1. All STAGE-N-DONE.md files at repo root
2. coordination/blockers.md — if any blockers were raised, those
   need resolving here

GIT
Branch: integration-v1
Commit prefix: "integration: ..."

TASKS

1. CROSS-STAGE SMOKE TEST
   pnpm install && pnpm build && pnpm dev
   Walk every route and confirm:
     /                       (Stage 3)
     /about                  (Stage 3)
     /safeguarding           (Stage 3)
     /withdraw               (Stage 3)
     /resources              (Stage 3)
     /podcasts               (Stage 4)
     /podcasts/sample-ep01   (Stage 4)
     /entrepreneurs          (Stage 5)
     /entrepreneurs/sample-001  (Stage 5)
     /reels                  (Stage 5)
     /audit                  (Stage 6)
     /sitemap.xml            (Stage 6)
     /robots.txt             (Stage 6)
     /a-bad-url              (404 page from Stage 6)

2. CROSS-LINKING
   Click every link from every page to every other page. Catalog
   any 404s. Cross-stage cross-links are the most likely failure mode.

3. CONSISTENCY CHECKS
   - Header nav appears identically on every page (sanity check that
     no parallel agent built their own header)
   - Footer is identical on every page (same sanity check)
   - Bilingual content renders consistently — same fonts, same
     layout convention, same lang attributes
   - Brand tokens used consistently — no rogue colors

4. SAFEGUARDING SPOT CHECK
   - No minor names appear anywhere
   - No personal contact details appear on any public page
   - No locations below district level appear
   - All entrepreneur photos respect photoConsent flag
   - /withdraw still has the TODO placeholder for the Plan IB contact
     — confirm this is captured as an open decision in STAGE-6-DONE.md
     and that the placeholder is OBVIOUS to a content reviewer

5. ACCESSIBILITY REGRESSION
   Re-run Lighthouse Accessibility on every route. Stage 6 may have
   set targets, but parallel work can drift. Confirm every route still
   ≥ 95.

6. BUILD ARTIFACT CHECK
   pnpm build
   Inspect /out:
     - One HTML file per static route
     - One HTML file per dynamic route
       (out/podcasts/sample-ep01/index.html, etc.)
     - sitemap.xml present
     - robots.txt present
     - All assets in /out/_next/

7. README UPDATE
   Update README.md to reflect the merged state:
     - All stages complete
     - How to run locally
     - How to add content
     - How to deploy (vercel --prod or git push to vercel-linked repo)
     - Open decisions remaining (link to V2V_Bridge_PRD_Staged_v1.1.md §6)

8. RELEASE NOTES
   Add CHANGELOG.md with v1.0.0 entry summarizing the build:
     - 6 stages, brief description of each
     - Stack
     - Known gaps (real content pending, real logo pending,
       PIB contact pending, domain pending)

9. PRE-LAUNCH CHECKLIST
   Add LAUNCH_CHECKLIST.md with items that must be true before
   announcing the site (not items for this branch — items for the
   business team):
     [ ] Real logo SVG placed at /public/logo.svg, replacing placeholder
     [ ] Real Plan IB Bangladesh contact substituted in withdraw.json
         and safeguarding.json
     [ ] Domain decision made and DNS pointed to Vercel
     [ ] Spotify show created, real episode embedIds replacing samples
     [ ] At least 1 entrepreneur record real (not sample) and published
     [ ] PIB sign-off received on the public pages (if required)
     [ ] /audit URL shared with PIB monitor contact

DEFINITION OF DONE
- All 13 routes load, render bilingual content, and link to each other
  correctly
- pnpm build succeeds; /out/ is deployable as-is
- Lighthouse Accessibility ≥ 95 on every route, Performance ≥ 85
- LAUNCH_CHECKLIST.md captures the remaining business items
- INTEGRATION-DONE.md summarizes what was checked, what was fixed,
  and what's outstanding

DO NOT
- Add new features. This is the integration pass, not a Stage 7.
- Defer real fixes to "polish later." If something breaks, fix it.
````

---

*End of Claude Code prompts file*
