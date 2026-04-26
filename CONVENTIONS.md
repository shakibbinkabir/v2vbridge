
## Project
V2V Bridge (Voice to Venture Bridge) — a 3-month youth-led storytelling
project under Plan International Bangladesh's Youth Equality Award 2026,
implemented by CapeC. Consulting in Satkhira and Dhaka. The site is a
curated public showcase + locked internal upload workflow. See
V2V_Bridge_PRD_v1.0.docx and V2V_Bridge_PRD_Staged_v1.1.md for full spec.

## Stack (locked, do not change)
- Next.js 15, App Router
- TypeScript strict
- Static export: output: 'export'
- Tailwind CSS v4
- pnpm (fall back to npm if unavailable)
- Node 20 LTS
- Fonts: Hind Siliguri (Bangla) + Inter (English) via next/font/google
- Smooth scroll: native CSS only — DO NOT add Lenis
- DO NOT add a SkipLink

## Brand tokens (use Tailwind utilities, never raw hex)
--brand-teal:   #0F4C5C
--brand-coral:  #E76F51
--brand-cream:  #F4F1ED
--brand-ink:    #1A1A1A
--brand-mute:   #555555
--brand-rule:   #D0D0D0

## Code style
- TypeScript strict; no `any` without justification comment
- React Server Components by default; "use client" only when needed
- Server-only code in src/lib/*; client components in src/components/*
- File-based content: read JSON from /content/, validate with Zod, never
  fetch at runtime
- No hardcoded copy in page files — all user-facing strings live in
  /content/pages/*.json as { en, bn } pairs
- Bangla text always rendered via <BilingualText> or font-bangla utility
  class so the right font loads
- Commit messages: imperative present tense, prefixed with stage (e.g.,
  "stage-3: build About page")

## Directory ownership
See V2V_Bridge_PRD_Staged_v1.1.md §3. If you are a parallel agent
(Stages 3–6) and you need to modify a file outside your assigned
directories, STOP. Write a note in coordination/blockers.md and finish
the rest of your tasks.

## Safeguarding rules baked into the build
- No identifiable face of any minor anywhere on the public layer
- No personal contact details of any contributor on the public layer
- No location below district level (Satkhira) on the public layer
- Photos appear only when entrepreneur record has photoConsent: true
- Items render publicly only when published: true

## Verification before declaring done
- pnpm typecheck (must be clean)
- pnpm build (must succeed)
- pnpm dev (must start without warnings)
- For UI work: visually verify in a browser at localhost:3000

## Handoff
At the end of your stage, create STAGE-N-DONE.md at repo root with:
- What you built (file list)
- What you skipped and why
- Anything the next stage needs to know (gotchas, decisions deferred,
  blockers raised)