# Portfolio Roadmap

What's pending, organized by area. See `CHANGELOG.md` for everything already shipped, and `DEVELOPMENT.md` for how this project is built/reviewed.

## v1 Checklist — Must complete before launch

- [🚩] Add photography images — **flagged/deferred by request.** Waiting on a planned rework of the upload/edit pipeline (admin CMS) before adding real photos, not just dropping files in `public/images/photography/`.
- [ ] Test contact form end-to-end — needs a real send against the live site (requires `RESEND_API_KEY`, which only exists in Vercel's env, and lands in your real inbox) — can't be faithfully done from this sandbox. Code-level checks done: validation paths (missing fields, bad email format) and the graceful-failure path all verified locally.
- [ ] Cross-browser test — check on Firefox and Safari / mobile (needs real browsers/devices, not available in this environment)

---

## Existing Feature Improvements

- [🚩] Photography section — carousel is empty until real images are added; deferred alongside the photography-images item above

---

## New Features

- [ ] Testimonials / recommendations section — shell is built (`TestimonialsSection.tsx`, renders nothing while `testimonials` in `src/data/portfolio.ts` is empty). **Blocked on you:** need 2-3 real quotes (who said it, their role, the quote itself) before this can go live — nothing left to build until then.

---

## Flagged during the Phase 0 repo audit (2026-09) — need your call, not auto-fixed

- [ ] `src/data/gallery.json` — 19 of 20 entries are hotlinked Unsplash stock photos carrying **fabricated EXIF metadata** (invented camera/lens/location per shot) presented as if genuine. Covered by the deferred photography-pipeline item above, but calling out the fabricated-metadata detail specifically since it's a step beyond "placeholder image" — worth stripping the fake EXIF fields even before real photos land, so nothing false ships in the meantime.
- [ ] `src/data/projects.json` — `react-projects-studio`'s `demoUrl` and all 5 `subProjects` demo URLs have a stray trailing dot before the slash (e.g. `https://voidomin.github.io/react-projects./`). Looks like a typo but touches a live external link — confirm the actual working URL before anyone edits it.
- [ ] Admin CMS (`src/app/admin/upload/page.tsx` + `src/app/api/admin/*`) has zero test coverage — confirmed fully wired and functional, but nothing would catch a regression. Good first candidate for a formal development phase.
- [ ] Real E2E test coverage — the one existing test (`src/app/photography/page.test.tsx`, Jest + RTL) is genuine and passes, but thin. `playwright` was installed with zero config/usage and has now been removed; if E2E testing is wanted, it should be added deliberately with a real `playwright.config.ts`, not left as an unused install.

## Flagged during the Phase 1 hardening pass (2026-09) — need visual/content judgment, not auto-fixed

- [ ] Sub-44px touch targets — the mobile sound toggle in `Navbar.tsx` (~28px) and `MountainAscentHUD.tsx`'s checkpoint buttons (~20px) are both under the 44×44px minimum. A blind CSS bump risks visibly breaking the HUD's tight vertical spacing, and this environment can't re-verify that live on a real mobile browser — needs a pass with actual visual verification, not a drive-by change.
- [ ] `100vh`/mobile-viewport bug — `ProjectsSection.tsx`'s desktop pinned-scroll height is computed in JS from `window.innerHeight`, not just a CSS unit, so the classic mobile address-bar-resize issue needs its own careful look (both the JS math and `HeroSection.tsx`'s `min-h-screen` scroll-cue positioning) rather than a drive-by `dvh` swap.
- [ ] Alt text quality — project/blog card images (`ProjectsSection.tsx`, `projects/[slug]/page.tsx`, `blog/[slug]/page.tsx`, `blog/page.tsx`) use the title as `alt` text rather than a real description of the image content. `gallery.json`'s photography entries already do this properly (genuinely descriptive alt text) — this is a content-writing decision for the rest, not a code defect.
- [ ] `FloatingActionButton.tsx`'s spring/rotate open/close animation doesn't check `prefers-reduced-motion` — lower priority than the fixes already made in this pass since it's a one-shot, interaction-triggered transition, not a continuous loop.

---

## Code Quality & Tooling

### Active (set up)
- [x] ESLint — extended with `prettier`, `no-console` warn, `prefer-const`, unused vars
- [x] Prettier — auto-format on commit (100 char width, double quotes, LF line endings)
- [x] Husky + lint-staged — pre-commit hook formats and lints staged files automatically
- [x] GitHub CodeQL — `.github/workflows/codeql.yml` runs on push/PR to main plus a weekly schedule

### To explore
- [ ] **Snyk** — scans npm dependencies for known CVEs; free tier, 2-min GitHub connect
- [ ] **DeepScan** — TypeScript-specific static analysis, catches subtle runtime bugs ESLint misses; free for public repos
- [ ] **Codacy** — full quality dashboard (grades, trends, PR comments), closest alternative to SonarCloud; free for public repos
- [ ] **Code Climate** — maintainability scores and test coverage trends over time; free for open source
