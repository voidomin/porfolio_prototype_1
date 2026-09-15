# Portfolio Roadmap

What's pending, organized by area. See `CHANGELOG.md` for everything already shipped, and `DEVELOPMENT.md` for how this project is built/reviewed.

## v1 Checklist — Must complete before launch

- [🚩] Add photography images — **flagged/deferred by request.** Waiting on a planned rework of the upload/edit pipeline (admin CMS) before adding real photos, not just dropping files in `public/images/photography/`.
- [ ] Test contact form end-to-end with a real send — needs a real send against the live site (requires `RESEND_API_KEY`, which only exists in Vercel's env, and lands in your real inbox) — can't be faithfully done from this sandbox. Everything short of that is now covered by `e2e/contact-form.spec.ts`: native browser validation (empty/malformed fields), and both the success and failure UI paths via network-mocked `/api/contact` responses — this is still a mock, not a live send, so the item stays open.
- [ ] Cross-browser test on real devices — the E2E suite now runs its full 18-check flow set on Chromium, Firefox, and WebKit (`playwright.config.ts`'s three projects), which caught two real, verified bugs immediately (see `CHANGELOG.md`). What's still open: Playwright's WebKit is not literally Safari and its Firefox isn't necessarily identical to a real Firefox install — actual Safari/Firefox on real desktop and mobile hardware still needs a human pass, not available in this environment.

---

## Existing Feature Improvements

- [🚩] Photography section — carousel is empty until real images are added; deferred alongside the photography-images item above

---

## New Features

- [ ] Testimonials / recommendations section — shell is built (`TestimonialsSection.tsx`, renders nothing while `testimonials` in `src/data/portfolio.ts` is empty). **Blocked on you:** need 2-3 real quotes (who said it, their role, the quote itself) before this can go live — nothing left to build until then.

---

## Flagged during the Phase 0 repo audit (2026-09) — need your call, not auto-fixed

- [ ] `src/data/projects.json` — `react-projects-studio`'s `demoUrl` and all 5 `subProjects` demo URLs have a stray trailing dot before the slash (e.g. `https://voidomin.github.io/react-projects./`). Turns out the trailing dot isn't the real issue — tested directly: the corrected URL (no dot, trailing slash) 404s too, so the GitHub Pages deployment isn't currently live at that path at all. **Blocked on you:** confirmed it's hosted somewhere else now — waiting on the real, current URL(s) to swap in.

## Flagged while adding admin CMS test coverage (2026-09) — minor, non-security gaps found and left as-is

- [ ] Admin page: selecting "Re-edit Visuals" on a published photo and submitting routes through the create/process pipeline rather than a dedicated update-with-new-visuals path (confirmed correct in practice — the gallery entry is upserted by matching `id` — but it's a real inconsistency with the plain metadata-edit path, which PUTs). Also, the "AI Suggest" button stays hidden during re-edit-visuals even though the underlying hook would allow it. Both are now pinned down by tests as current behavior; neither is a functional bug worth a source change on its own.

## Flagged during the Phase 1 hardening pass (2026-09) — need visual/content judgment, not auto-fixed

- [ ] `100vh`/mobile-viewport bug — `ProjectsSection.tsx`'s desktop pinned-scroll height is computed in JS from `window.innerHeight`, not just a CSS unit, so the classic mobile address-bar-resize issue needs its own careful look (both the JS math and `HeroSection.tsx`'s `min-h-screen` scroll-cue positioning) rather than a drive-by `dvh` swap. Genuinely needs a real mobile browser to verify against, not headless emulation.
- [ ] `src/data/projects.json` — the 5 `subProjects` under `react-projects-studio` (Vocab Mastery, Caffiend Tracker, Movie Discovery, Pokedex Explorer, Todo Manager) all use hotlinked generic Unsplash stock photos as their thumbnail, not real screenshots of those apps — the same class of issue as `gallery.json`'s fabricated EXIF, just for project images instead of photos. The 5 top-level project images are genuine screenshots and now have real, descriptive `imageAlt` text; these 5 sub-project placeholders need either real screenshots or an explicit decision to leave them as generic stock art.
- [ ] A residual initial-load layout shift (~0.45 CLS) remains on `NatureScene.tsx`'s back mountain-layer element, tied to mounting the Hero's WebGL canvas. Traced this fairly deep (confirmed it requires `HeroScene`'s presence via a clean mobile-viewport test; ruled out timing/contention as the mechanism since deferring the mount or reducing the canvas's own cost didn't change the score at all; converting every percentage-based size/position in `NatureScene.tsx` to viewport units fixed 4 of 5 impacted elements and cut the score from 0.48 to 0.45) but this last element didn't respond to the same fix. Looks like a deeper browser rendering-pipeline interaction between WebGL canvas insertion and this specific element — would need real DevTools Performance-panel profiling on an actual GPU (not headless/software-rendered Chromium) to go further. **Follow-up**: this same element now also fades (opacity-only, deliberately — see the 2D/3D hero integration changelog entry) once the 3D scene reports itself active; a real GPU profiling pass, whenever it happens, should account for that new transition too, not just initial mount.

<!-- Fixed in the Phase 1 pass, verified with real Playwright interaction tests (not just CSS presence): sub-44px touch targets on the mobile sound toggle and MountainAscentHUD's checkpoint buttons (extended via an invisible ::before hit area, no visible size change — confirmed clicks outside the visible dot correctly register and trigger navigation, and the HUD doesn't clip at short viewport heights); FloatingActionButton's rotate animation now respects prefers-reduced-motion; alt text on the 5 real project screenshots now describes the actual image instead of repeating the title. -->

---

## Code Quality & Tooling

### Active (set up)
- [x] ESLint — flat config (`eslint.config.mjs`, required by `eslint-config-next` 16.x), extended with `prettier`, `no-console` warn, `prefer-const`, unused vars
- [x] Prettier — auto-format on commit (100 char width, double quotes, LF line endings)
- [x] Husky + lint-staged — pre-commit hook formats and lints staged files automatically
- [x] GitHub CodeQL — `.github/workflows/codeql.yml` runs on push/PR to main plus a weekly schedule
- [x] Playwright E2E suite — `e2e/*.spec.ts`, runs in CI (`.github/workflows/ci.yml`) on every push/PR to main, now across Chromium, Firefox, and WebKit. Scoped to safe-to-automate flows (navigation, Command Palette, contact form with network mocking, the admin security gate, responsive/reduced-motion/keyboard-accessibility smoke checks) — full admin CMS write flows and a live contact-form send are explicitly out of scope, see the v1 checklist above.
- [x] Snyk — `.github/workflows/snyk.yml` running on push/PR/weekly schedule with a real `SNYK_TOKEN`. First real scan flagged ~20 High/Critical CVEs in `next@14.0.4` itself; fixed by the Next.js 16 upgrade, see `CHANGELOG.md`.

### To explore
- [ ] **DeepScan** — TypeScript-specific static analysis, catches subtle runtime bugs ESLint misses; free for public repos
- [ ] **Codacy** — full quality dashboard (grades, trends, PR comments), closest alternative to SonarCloud; free for public repos
- [ ] **Code Climate** — maintainability scores and test coverage trends over time; free for open source

## Flagged during the Next.js 16 / React 19 upgrade (2026-09) — deliberate, scoped-out follow-ups

- [ ] `eslint-plugin-react-hooks` v6 (bundled by `eslint-config-next` 16.x) ships React Compiler-readiness rules (`purity`, `set-state-in-effect`, `preserve-manual-memoization`, `refs`) as part of its "recommended" config. Disabled all four in `eslint.config.mjs` with a comment — this project doesn't adopt the React Compiler, and the findings were false positives against patterns that are correct here (stable-per-mount `Math.random()` in a `useMemo`/empty-dep-array initializer, `HeroScene.tsx`'s lazy-ref-init, `useSafeReducedMotion`'s matchMedia-syncing effect). Revisit only if this project ever adopts the Compiler.
- [ ] ESLint is pinned to the latest 9.x line (`^9.39.5`), not 10.x — `eslint-config-next@16.3.5`'s bundled `eslint-plugin-react@7.37.5` peer-requires `eslint@^9.7` and breaks at runtime under ESLint 10 (`contextOrFilename.getFilename is not a function`, a real ESLint 9→10 rule-API change). ESLint 10 was extremely recently released; bump once `eslint-config-next` catches up.
- [ ] `@react-three/fiber` is pinned to `9.7.0`, and `react`/`react-dom`/`@types/react`/`@types/react-dom` to the `19.2.x` line rather than the newer `19.3.0` — `@react-three/fiber@9.7.0`'s peer range is `>=19 <19.3` (hasn't caught up to React 19.3 yet, which was published very recently). Bump React once a `@react-three/fiber` release widens that range.
