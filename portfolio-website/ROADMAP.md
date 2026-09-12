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

- [ ] `100vh`/mobile-viewport bug — `ProjectsSection.tsx`'s desktop pinned-scroll height is computed in JS from `window.innerHeight`, not just a CSS unit, so the classic mobile address-bar-resize issue needs its own careful look (both the JS math and `HeroSection.tsx`'s `min-h-screen` scroll-cue positioning) rather than a drive-by `dvh` swap. Genuinely needs a real mobile browser to verify against, not headless emulation.
- [ ] `src/data/projects.json` — the 5 `subProjects` under `react-projects-studio` (Vocab Mastery, Caffiend Tracker, Movie Discovery, Pokedex Explorer, Todo Manager) all use hotlinked generic Unsplash stock photos as their thumbnail, not real screenshots of those apps — the same class of issue as `gallery.json`'s fabricated EXIF, just for project images instead of photos. The 5 top-level project images are genuine screenshots and now have real, descriptive `imageAlt` text; these 5 sub-project placeholders need either real screenshots or an explicit decision to leave them as generic stock art.
- [ ] A residual initial-load layout shift (~0.45 CLS) remains on `NatureScene.tsx`'s back mountain-layer element, tied to mounting the Hero's WebGL canvas. Traced this fairly deep (confirmed it requires `HeroScene`'s presence via a clean mobile-viewport test; ruled out timing/contention as the mechanism since deferring the mount or reducing the canvas's own cost didn't change the score at all; converting every percentage-based size/position in `NatureScene.tsx` to viewport units fixed 4 of 5 impacted elements and cut the score from 0.48 to 0.45) but this last element didn't respond to the same fix. Looks like a deeper browser rendering-pipeline interaction between WebGL canvas insertion and this specific element — would need real DevTools Performance-panel profiling on an actual GPU (not headless/software-rendered Chromium) to go further.

<!-- Fixed in the Phase 1 pass, verified with real Playwright interaction tests (not just CSS presence): sub-44px touch targets on the mobile sound toggle and MountainAscentHUD's checkpoint buttons (extended via an invisible ::before hit area, no visible size change — confirmed clicks outside the visible dot correctly register and trigger navigation, and the HUD doesn't clip at short viewport heights); FloatingActionButton's rotate animation now respects prefers-reduced-motion; alt text on the 5 real project screenshots now describes the actual image instead of repeating the title. -->

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
