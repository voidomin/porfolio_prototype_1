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
- [ ] Navbar — no active section highlighting as user scrolls
- [ ] Hero intro — paragraph is slightly long for a first impression; tighten the copy

---

## New Features

- [ ] Resume / CV download button — add to hero or navbar; recruiters always want this
- [ ] Project detail pages — `/projects/[slug]` with full case study layout (problem → approach → outcome → tech stack)
- [ ] Testimonials / recommendations section — 2-3 quotes from colleagues or managers
- [ ] Availability badge — "Open to work" or "Available for freelance" toggle in hero or navbar
- [ ] Blog / writing section — `blogPosts` data layer already exists in `src/data/portfolio.ts`
- [ ] Mobile touch ripple — lightweight tap effect to replace the cursor trail (disabled on mobile)
- [ ] PWA support — `manifest.json` + offline page so site installs on mobile
- [ ] Copy-email-to-clipboard button — next to email address in contact section
- [ ] Animated page transitions — between home and project detail pages

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
