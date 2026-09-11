# Development Guide

How this project is set up, verified, and worked on. `README.md` covers what the site is; `ROADMAP.md`/`CHANGELOG.md` cover what's pending/shipped. This covers *how* changes get made.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in RESEND_API_KEY / GEMINI_API_KEY / ENABLE_ADMIN as needed
npm run dev
```

See `.env.local.example` for what each variable does and which features need it. Nothing in `.env.local`/`.env` should ever be committed — only `.env.local.example` is tracked.

## Before every commit

Run all four, in order. All must be clean — not "just the one you touched":

```bash
npx tsc --noEmit -p .
npx eslint . --max-warnings=0
npm run build
npm test
```

`eslint --max-warnings=0` is the project's actual bar, not a suggestion — the pre-commit hook (Husky + lint-staged) enforces it on staged files automatically, but running it yourself first on the whole project catches issues in files you didn't touch that a change elsewhere can still break (e.g. a shared type, a shared hook). `npm run build` is the one that catches things `tsc`/`eslint` alone won't — SSR-incompatible code, bundle-size regressions, route-level errors.

If a change touches anything visual or interactive, verify it actually renders/behaves correctly — a clean build proves the code compiles, not that the feature works. Where this environment allows it, that means:

- A real local server (`npm run build && npm run start`) rather than trusting `npm run dev`'s behavior alone, since dev and prod builds can differ (this bit us at least twice this session — Lenis's chunk hashes, and a stale dev-server 400 that looked like a real bug and wasn't).
- Screenshotting or otherwise inspecting the actual rendered output for anything visual, not just "the build succeeded." (Playwright screenshot verification caught the 3D hero scene's mountains rising into the headline/CTAs before it ever shipped — a clean build alone would have missed it entirely.)
- For anything scroll-, animation-, or timing-related: test at both very fast and very slow interaction speeds, not just the speed it happened to be built at. Two real bugs this session (the Projects section's pin desync, Lenis's stale scroll-limit cap) only showed up under fast, sustained interaction.

## When to plan first vs. just do it

Small, well-scoped, single-file fixes (a typo, a genuine one-line bug, a copy change) — just make the change and run the verification checklist above.

Anything bigger goes through Plan Mode first: new dependencies, anything touching more than 2-3 files, anything affecting existing scroll/animation behavior site-wide, or any product decision (removing a feature, changing what's publicly exposed, an architecture choice with real trade-offs). The pattern that worked all session: research the actual codebase and any third-party library source before proposing an approach (not from memory/assumption), write the plan with a **Context** section explaining *why*, get it approved, then implement with the same verification discipline above. Concrete example from this repo's own history: the Lenis integration looked like "install a library and wire it up," but reading Lenis's actual source first surfaced a real architectural risk (nested-scroll containers breaking, a stale-scroll-limit bug) that would have been very easy to ship blind.

## Backlog process

- **`ROADMAP.md`** — what's pending, organized by area. Add new work here as it's identified, with enough context (why, what's blocking it) that it's still meaningful weeks later, not just a one-line title.
- **`CHANGELOG.md`** — what's shipped. When an item in `ROADMAP.md` is done and verified, move it here (don't just delete it) with a short note of what the actual fix/feature was and why, not just what changed.
- Items blocked on the user (real content, a product decision, something needing live-site/real-hardware verification this environment can't do) get called out explicitly as blocked, not silently skipped or guessed around.

## Admin CMS

`src/app/admin/upload` + `src/app/api/admin/*` are gated by `src/middleware.ts`: the whole surface 404s unless `ENABLE_ADMIN=true`, in both `next dev` and a built/`next start` server. It has no test coverage today (see `ROADMAP.md`) — treat changes to it with proportionally more manual verification since nothing else will catch a regression.
