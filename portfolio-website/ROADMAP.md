# Portfolio Roadmap

## v1 Checklist — Must complete before launch

- [x] Add profile photo — `public/images/avatar.png` present, matches `personalProfile.avatar`
- [🚩] Add photography images — **flagged/deferred by request.** Waiting on a planned rework of the upload/edit pipeline (admin CMS) before adding real photos, not just dropping files in `public/images/photography/`.
- [ ] Test contact form end-to-end — needs a real send against the live site (requires `RESEND_API_KEY`, which only exists in Vercel's env, and lands in your real inbox) — can't be faithfully done from this sandbox. Code-level checks done: validation paths (missing fields, bad email format) and the graceful-failure path all verified locally, see fix below.
- [x] Run Lighthouse audit — ran against a local production build. Scores: **Performance 90, Accessibility 96, Best Practices 96, SEO 100.** Fixed the two real findings: (1) project/social icon-only links had no accessible name for screen readers — added `aria-label`/`title` in `ProjectsSection.tsx` and `ContactSection.tsx`; (2) a console 404 for `/_vercel/insights/script.js` is expected locally (Vercel Analytics only serves that script when deployed on Vercel) — not a bug. Remaining perf flags (LCP ~2.5s, main-thread work) are typical for a heavy animated hero and not critical; revisit if real users report slowness.
- [ ] Cross-browser test — check on Firefox and Safari / mobile (needs real browsers/devices, not available in this environment)

---

## Existing Feature Improvements

- [🚩] Photography section — carousel is empty until real images are added; deferred alongside the photography-images item above
- [x] Skills section — hobbies moved to a plain "Beyond the Screen" tag strip (no fake percentages); "Other Skills" renamed to "Research & Computer Science"
- [x] About timeline — icons now map per role (Database/ParentOf, Compass/Freelance, Code2/Merck, Microscope/IISc) instead of cycling a generic Tent/Compass/Flame set
- [x] MountainAscentHUD — checkpoint labels synced to actual section titles (The Forest Path, The Meadow, Campfire at Dusk); added missing "Field Notes" checkpoint for the Writing section
- [x] Navbar — active section highlighting as user scrolls (already implemented via IntersectionObserver in `Navbar.tsx`)
- [x] Hero intro — tightened from ~27 to ~21 words, cut repetitive "clarity, reliability, and useful detail" close

---

## New Features

- [🚫] Resume / CV download button — **removed by request.** Decided against a public resume download link; don't want it scraped/downloaded by random visitors. The CTA has been removed from `HeroSection.tsx`; no `resume.pdf` will be added.
- [x] Project detail pages — `/projects/[slug]` with case study layout (Overview → Approach → Outcome → Tech Stack). Content is auto-derived from existing `description`/`longDescription` fields as a starting draft — worth a human pass to sharpen the writing.
- [ ] Testimonials / recommendations section — shell is built (`TestimonialsSection.tsx`, renders nothing while `testimonials` in `src/data/portfolio.ts` is empty). **Blocked on you:** need 2-3 real quotes (who said it, their role, the quote itself) before this can go live — nothing left to build until then.
- [x] Availability badge — "Open to work" pill added to hero, driven by `personalProfile.openToWork` in `src/data/portfolio.ts` (flip to `false` to hide it)
- [x] Blog / writing section — first real post published ("What a Hundred Mutations Taught Me About Trusting a Single Answer"), "Writing" added to `navigationItems` (→ `/blog`), `/blog` + post slugs added to `sitemap.ts`. Cover image is a generated SVG-style illustration via `src/app/images/blog/protein-research/route.tsx` (same `ImageResponse` technique as the favicon) since no real photo was available. More posts can be added the same way — see the two other topics already scoped (career pivot, building this site).
- [x] Mobile touch ripple — `MobileTouchRipple.tsx`, tap-to-ripple feedback on screens under 768px, mounted alongside the desktop-only `InteractiveTrail`
- [x] PWA support — `manifest.ts` + generated icons (`/icon-192`, `/icon-512`) + `sw.js`/`offline.html` for a basic offline fallback page
- [x] Copy-email-to-clipboard button — next to email address in contact section (`ContactSection.tsx`, `handleCopyEmail`)
- [x] Animated page transitions — `src/app/template.tsx` fades/slides in on every route change (home ↔ photography ↔ project/blog pages)

---

## Code Quality & Tooling

### Active (set up)
- [x] ESLint — extended with `prettier`, `no-console` warn, `prefer-const`, unused vars
- [x] Prettier — auto-format on commit (100 char width, double quotes, LF line endings)
- [x] Husky + lint-staged — pre-commit hook formats and lints staged files automatically

### To explore
- [ ] **Snyk** — scans npm dependencies for known CVEs; free tier, 2-min GitHub connect
- [ ] **GitHub CodeQL** — free on public repos, runs in GitHub Actions, catches security bugs (XSS, injection) in your own code; zero maintenance once set up
- [ ] **DeepScan** — TypeScript-specific static analysis, catches subtle runtime bugs ESLint misses; free for public repos
- [ ] **Codacy** — full quality dashboard (grades, trends, PR comments), closest alternative to SonarCloud; free for public repos
- [ ] **Code Climate** — maintainability scores and test coverage trends over time; free for open source

---

## Completed

- [x] Shared ScrollContext — consolidated 7 separate `useScroll()` calls into one
- [x] NatureScene sky — replaced per-frame CSS gradient interpolation with IntersectionObserver + opacity cross-fade
- [x] ChapterTitleIntro — fixed layout thrashing; section positions now cached on mount
- [x] StorybookCursor — added `prevValue` refs to stop `setState` on every `pointermove`
- [x] SoundscapeManager — replaced `scrollProgress` state with direct MotionValue listener
- [x] InteractiveTrail — `scrollProgress` converted to ref, idle RAF guard, canvas DPR capped at 1.5
- [x] BirdFlock / FloatingLeaves — disabled on mobile
- [x] Contact form API — `/api/contact` route powered by Resend
- [x] OG image — `opengraph-image.tsx` for rich social share previews
- [x] Loading screen — dawn sunrise intro shown once per session via `sessionStorage`
- [x] Hero tags — now data-driven from `personalProfile.tags`
- [x] About avatar — supports real photo via `next/image`, falls back to initial letter
- [x] Favicon — SVG favicon with sun rising over mountain silhouettes
- [x] Custom 404 page — on-brand dawn/nature theme with back-to-trailhead CTA
- [x] Content proofread — all section copy checked; one punctuation fix applied
- [x] `RESEND_API_KEY` added to Vercel environment variables
- [x] Photo admin CMS streamlined — browser drag-and-drop batch upload, GPS-based location auto-fill, one-click Process & Commit (local commit, no auto-push), Quick-Import All batch action, and visual re-edit (crop/color/watermark) without delete + redo
- [x] JSON-LD structured data — Person + WebSite schema added to root layout
- [x] `/photography` metadata — own title/description/OG instead of inheriting the homepage's
- [x] Fixed a long-standing ESLint crash on `SkillsSection.tsx` (a `TSMappedType` parser bug in this typescript-eslint version) that was silently aborting lint before it ever reached later files — this had been masking real `prefer-const` compile errors in `InteractiveTrail.tsx` that `next build`'s lint step would otherwise fail on. Both are fixed; `npm run build` now lints cleanly (warnings only, no errors).
- [x] Contact form API robustness — `new Resend(...)` was instantiated before request validation and outside the `try/catch` in `route.ts`; a missing/invalid `RESEND_API_KEY` crashed the whole route with an unhandled 500 instead of the frontend's expected JSON error. Moved the Resend instantiation inside the try block, after validation. Verified locally: missing fields → 400 JSON, invalid email → 400 JSON, missing API key → graceful 500 JSON.
