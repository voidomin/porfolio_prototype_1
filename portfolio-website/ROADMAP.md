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
- [x] Cmd/Ctrl+K command palette — `CommandPalette.tsx`, mounted globally; jumps to any section, project, or blog post. Doubles as the only navigation on sub-pages (blog posts, project case studies, photography), which previously had none.
- [x] Quick Overview page (`/overview`) — print-friendly, on-site one-page summary (experience, skills, selected projects, contact) so a recruiter can screen in ~30 seconds or save their own PDF via the browser's print dialog. Noindexed. Linked from the hero and the command palette.

---

## Code Quality & Tooling

### Active (set up)
- [x] ESLint — extended with `prettier`, `no-console` warn, `prefer-const`, unused vars
- [x] Prettier — auto-format on commit (100 char width, double quotes, LF line endings)
- [x] Husky + lint-staged — pre-commit hook formats and lints staged files automatically

### To explore
- [ ] **Snyk** — scans npm dependencies for known CVEs; free tier, 2-min GitHub connect
- [x] **GitHub CodeQL** — `.github/workflows/codeql.yml` runs on push/PR to main plus a weekly schedule
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
- [x] Multi-day-idle-tab lag — `InteractiveTrail`'s canvas loop, `BirdFlock`'s spawn timer, and `SoundscapeManager`'s audio scheduler ran continuously with no regard for tab visibility. Added Page Visibility handling to all three so they fully pause when hidden and cleanly resume when foregrounded, instead of grinding for days unattended. Also fixed `useIntersectionObserver` recreating its observer on every trigger due to a dependency-array bug.
- [x] Hero load delay — Lighthouse traced the LCP element (hero intro paragraph) to a ~3.5s render delay despite a 9ms TTFB. Root cause: the full-viewport `LoadingScreen` overlay stayed up ~3.7s (2.8s + 0.9s fade) sitting on top of already-rendered content. Cut to ~1.9s, made skippable by any interaction, and tightened the hero's own staggered reveal by ~35-40%.
- [x] CTA shape consistency — Contact's submit button and the Writing/Photography "view all" CTAs used `rounded-xl` while Hero/Publications used `rounded-full`; unified all primary CTAs to `rounded-full`.
- [x] Fast-scroll desync in Projects — the pinned horizontal track used a fixed fraction-per-frame lerp with unbounded lag under fast scrolling, while the pin/unpin state was computed instantly with no smoothing — replaced with deltaTime-based exponential smoothing bounding max lag to ~120ms regardless of scroll speed.
- [x] Off-center elements — hero scroll prompt, Navbar's active-section dot, and StorybookCursor's tooltip all used Tailwind's `-translate-x-1/2` on an element that also had a Framer Motion `animate`/`layoutId`, which silently overwrites Tailwind's class-based transform. Fixed all three.
- [x] Deprecated `apple-mobile-web-app-capable` meta tag console warning — added the standard `mobile-web-app-capable` tag alongside it.
- [x] Homepage redesign — phase 1: each of the 7 chapter transitions now has a distinct entrance personality (mist-resolve, sunlight-wipe, ripple-focus, glow-bloom, paper-settle) instead of the same fade-up repeated everywhere. Phase 2: cursor-tracked CSS 3D perspective tilt on the hero. Phase 3: Skills leans further into the "growing vine" metaphor (leaf-tip sprout on bars, hobby icons), Publications cross-links its companion blog post instead of feeling sparse, Footer gained quick-links + a tech-stack credit line.
- [x] GitHub CodeQL now actually running — the workflow was passing the wrong assumption ("free on public repos") without checking this repo was private, where GitHub code scanning requires paid GitHub Advanced Security. Repo made public (checked first for secrets/`.env` files/hardcoded keys — none found); CodeQL now runs clean on every push.
- [x] Homepage redesign — phase 4: hero interactive vector illustration (`TrailHiker.tsx`) + a real "Built for this trail with" tech-logo strip (`TechStackStrip.tsx`, react-icons/si brand marks) surfaced right after the hero instead of staying buried in the Meadow chapter. **The hiker illustration was later removed** — feedback was that a hand-coded inline-SVG humanoid figure looked crude next to the rest of the site's polish. Tech-stack strip stays.
- [x] Cleaned up all remaining ESLint warnings from the Vercel build log — unused `catch (e)` bindings, `ignoreRestSiblings` for the framer-motion/next-image test mocks, a stray `console.debug`. `npx eslint . --max-warnings=0` and `npm run build` both come back completely clean now.
- [x] Wired up Lenis smooth-scroll (`@studio-freight/lenis` was an installed-but-unused dependency). Read Lenis's actual source first — its default config animates the real document scroll position, so nothing else needed to change — but found and fixed a real regression via Playwright testing: Lenis's own autoResize doesn't reliably catch content-driven height growth (a known Lenis limitation), so the Projects section's dynamically-growing pinned-scroll container could leave Lenis's cached scroll limit stale, silently capping how far the page could scroll with no self-correction. Fixed by checking `scrollHeight` every raf tick and calling `lenis.resize()` on change. Also added `data-lenis-prevent` to every nested-scroll container site-wide (command palette, photography lightbox/filmstrip, project sub-tabs, admin panels) since Lenis intercepts wheel events globally and would otherwise silently break scrolling inside them.
- [x] Recurring trail-flag marker (`ChapterMarker.tsx`) — a small vector flag-on-a-post that "plants" with a spring bounce at the top of all 7 chapter headers, matched to each section's accent color. Replaces the removed hiker as the "more vectors" answer — a simple geometric shape reads as intentional, unlike a hand-coded figure.
- [x] Depth-parallax on existing section decorations (About's trees, Skills/Publications/Photography's ambient glow layers) — checked first that this wouldn't duplicate the already-global `FloatingLeaves` effect, then gave previously-static decorative layers real scroll-linked movement using the same `useScroll`/`useTransform` technique proven in `SectionDivider.tsx`.
- [x] Fixed Lenis lag on trackpad two-finger scroll — a trackpad gesture fires as `wheel` events (not touch), so it's governed by Lenis's `smoothWheel` easing; at the default `lerp` (0.1) that's ~500ms to converge, fine for discrete mouse clicks but felt like lag on already-smooth continuous trackpad input. Tuned to `lerp: 0.3` (~165ms).
- [x] Real 3D WebGL hero scene (`src/components/three/HeroScene.tsx`) — three.js + `@react-three/fiber` (exact-pinned, no `@react-three/drei` to minimize bundle weight), three layered/lit/fogged mountain-ridge meshes with cursor-driven camera parallax, replacing the hero's flat 2D backdrop only. Loaded via `next/dynamic({ssr:false})`, gated to desktop + non-reduced-motion so mobile never fetches the chunk. Real cost verified: ~170.6KB gzipped, isolated to its own code-split chunk (homepage's First Load JS grew ~1KB). Caught and fixed a real legibility bug via screenshot verification — the mountains' default position rose into the headline/CTAs before being pushed down. Also removed `next.config.js`'s dead `.glsl` webpack rule (loaders weren't even installed).
