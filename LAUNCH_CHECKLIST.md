# V2V Bridge — Launch Checklist

Items the business team must complete before announcing the site
publicly. Code is ready and `integration-v1` builds clean — these are
content + ops decisions that do not require a code change.

Target launch date: **15 May 2026**.

## Brand + identity

- [ ] Real logo SVG placed at `public/logo.svg`, replacing the
      placeholder at `public/logo-placeholder.svg`. The Header
      currently references the placeholder file by name; once
      `logo.svg` exists, update the reference (one-line change).
- [ ] Real OG image at `public/og-default.png` (current is a
      brand-coloured placeholder). 1200×630, ≤ 200 KB.

## Plan International Bangladesh (PIB)

- [ ] Real Plan IB Bangladesh focal-point contact substituted in
      `content/pages/withdraw.json`. Replace the inline `TODO: replace
      with confirmed PIB contact (name, phone, email)` marker (visible
      in both English and Bangla on `/withdraw`). Mirror the same
      contact in `content/pages/safeguarding.json` if a contact line
      is added there.
- [ ] PIB sign-off received on all five Stage 3 public pages
      (`/`, `/about`, `/safeguarding`, `/withdraw`, `/resources`),
      if their compliance review requires it.
- [ ] `/audit` URL shared with the PIB monitor contact. The page
      itself is `noindex`/`nofollow` and disallowed in `robots.txt`,
      so PIB needs the link directly.

## Domain + hosting

- [ ] Production domain decision made (`.org` vs `.com.bd`) — see
      PRD §6.
- [ ] DNS pointed at Vercel.
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel project env to the chosen
      origin (e.g. `https://www.v2vbridge.org`). Sitemap and
      Organization JSON-LD both read this; defaults to
      `https://www.v2vbridge.org` if unset.
- [ ] HTTPS verified on the production domain.

## Podcast

- [ ] Spotify show created and verified.
- [ ] Real Spotify episode `embedId` values substituted in each
      `content/podcasts/sample-ep0*.json`. Rename the files from
      `sample-epXX.json` to the real episode slug at the same time so
      URLs stay clean (`/podcasts/<slug>/`).

## Entrepreneur content

- [ ] At least one entrepreneur record real (not `sample-XXX`) and
      `published: true`. Replacing one of `sample-001`..`sample-005`
      in place is fine if the consent form is filed and both YSC
      reviewers + the project lead are recorded under `reviewers`.
- [ ] Each published record has its real photo at
      `public/photos/<id>.jpg` (only if `photoConsent: true`) or
      relies on the `SectorIcon` fallback if not.
- [ ] Reels are reviewed and at least one is `published: true` per
      published entrepreneur.

## Final pre-launch verification

- [ ] `pnpm build` clean on the deploy commit.
- [ ] Lighthouse re-run on every route post-content-publish; verify
      Accessibility ≥ 95, Performance ≥ 85, especially on
      `/podcasts/[id]` (Spotify embed) and `/reels` (multi-platform
      embeds), which can drift below 85 depending on third-party
      CDN weather.
- [ ] Sitemap lists every published detail URL (auto, no action — verify
      after content publish).
- [ ] `/audit` table shows the published items count > 0 and zero
      `entrepreneursMissingConsent`.
- [ ] No `TODO:` markers remain in any rendered page (grep
      `out/**/*.html` after build).
