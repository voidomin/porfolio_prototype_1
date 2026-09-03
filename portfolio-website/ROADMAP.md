# Portfolio Roadmap

## v1 Checklist — Must complete before launch

- [ ] Add profile photo — drop photo as `public/images/avatar.jpg`
- [ ] Add photography images — add photos to `public/images/photography/` and update `src/data/gallery.json`
- [ ] Test contact form end-to-end — submit form on live site, verify email arrives in inbox
- [ ] Run Lighthouse audit and fix any critical issues (performance, accessibility, SEO)
- [ ] Cross-browser test — check on Firefox and Safari / mobile

---

## Existing Feature Improvements

- [ ] Photography section — carousel is empty until real images are added
- [ ] Skills section — separate hobbies from technical skills (recruiters see them mixed together)
- [ ] About timeline — icons (Tent, Compass, Flame) don't match actual job roles; replace with relevant ones
- [ ] MountainAscentHUD — checkpoint labels ("Sunny Meadow") don't match section titles ("The Meadow"); sync them
- [x] Navbar — active section highlighting as user scrolls (already implemented via IntersectionObserver in `Navbar.tsx`)
- [ ] Hero intro — paragraph is slightly long for a first impression; tighten the copy

---

## New Features

- [x] Resume / CV download button — added to hero CTA row, links to `/resume.pdf`. **Action needed: add the actual `public/resume.pdf` file** — the link 404s until it's there.
- [x] Project detail pages — `/projects/[slug]` with case study layout (Overview → Approach → Outcome → Tech Stack). Content is auto-derived from existing `description`/`longDescription` fields as a starting draft — worth a human pass to sharpen the writing.
- [ ] Testimonials / recommendations section — 2-3 quotes from colleagues or managers
- [ ] Availability badge — "Open to work" or "Available for freelance" toggle in hero or navbar
- [ ] Blog / writing section — `blogPosts` data layer already exists in `src/data/portfolio.ts`
- [ ] Mobile touch ripple — lightweight tap effect to replace the cursor trail (disabled on mobile)
- [ ] PWA support — `manifest.json` + offline page so site installs on mobile
- [ ] Copy-email-to-clipboard button — next to email address in contact section
- [ ] Animated page transitions — between home and project detail pages

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
