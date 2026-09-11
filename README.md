# 🏔️ Nature Storytelling Portfolio

An immersive, scroll-driven portfolio website built with Next.js — designed as a journey through a day in the mountains, from dawn to starlit night.

## ✨ Design Concept

The page tells a story through nature. As visitors scroll, they travel through a complete day cycle:

| Chapter | Section | Time of Day | Atmosphere |
|---------|---------|------------|------------|
| 1 | **Hero** | Dawn | Golden sunrise, parallax mountains, cinematic name reveal |
| 2 | **About** | Morning Forest | Misty greens, winding trail timeline |
| 3 | **Skills** | Sunny Meadow | Bright garden beds, vine-like skill bars |
| 4 | **Projects** | River Crossing | Stone-textured cards, water ripple effects |
| 5 | **Publications** | Afternoon Clearing | Parchment cards, warm golden light |
| 6 | **Photography** | Golden Hour | Art-gallery matte frames, full EXIF lightbox |
| — | **Writing** | Field Notes | Blog/essay preview cards, linked to `/blog` |
| 7 | **Contact** | Campfire at Dusk | Firefly particles, warm glass form |
| — | **Footer** | Starlit Night | Twinkling stars, shooting star on hover |

## 🎨 Dynamic Nature Elements

- **Parallax mountain silhouettes** — 3-layer SVG mountains with depth
- **Scroll-driven sky gradient** — dawn gold → noon blue → dusk red → midnight indigo
- **Animated bird flocks** — SVG birds fly across the viewport periodically
- **Floating leaf particles** — organic drift with rotation and varying opacity
- **Sun/Moon arc** — a celestial body that moves as you scroll
- **Twinkling stars** — fade in as you approach the footer
- **Firefly particles** — glow in the contact section
- **Organic terrain dividers** — mountain ridges, forest treelines, rolling hills between sections, each with its own subtle scroll-linked depth parallax
- **Nature cursor** — leaf-green custom cursor with "Explore" tooltip
- **Compass FAB** — floating compass rose for quick navigation
- **Real 3D hero scene** — a genuine WebGL mountain scene (three.js + react-three-fiber) with lighting, fog, and cursor-driven camera parallax, replacing the flat 2D backdrop for just the hero; desktop-only and skipped entirely under reduced-motion so nothing extra is ever downloaded on mobile
- **Chapter markers** — a small trail-flag vector "plants" at the top of each chapter, tying the storytelling together
- **Buttery smooth-scroll** — Lenis-powered eased scrolling site-wide, tuned specifically so it doesn't fight trackpad input
- **Cmd/Ctrl+K command palette** — jump to any section, project, or blog post from anywhere, including the sub-pages that have no other navigation of their own

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom nature palette
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + CSS keyframes
- **Smooth scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **3D**: [three.js](https://threejs.org/) + [react-three-fiber](https://docs.pmnd.rs/react-three-fiber) (hero scene only, dynamically loaded)
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope), [Fraunces](https://fonts.google.com/specimen/Fraunces), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Icons**: [Lucide React](https://lucide.dev/) + [react-icons](https://react-icons.github.io/react-icons/) (brand logos)
- **Email**: [Resend](https://resend.com/) (contact form)
- **Testing**: Jest + React Testing Library
- **Analytics**: Vercel Analytics

## 📁 Project Structure

```
portfolio-website/
├── src/
│   ├── middleware.ts             # Gates /admin and /api/admin behind ENABLE_ADMIN
│   ├── app/
│   │   ├── globals.css          # Nature theme, day-cycle variables
│   │   ├── layout.tsx           # Root layout with fonts, Lenis, command palette
│   │   ├── page.tsx             # Main page — assembles all chapters
│   │   ├── blog/                # Writing section archive (/blog, /blog/[slug])
│   │   ├── projects/[slug]/     # Project case-study pages
│   │   ├── photography/         # Full photography gallery route
│   │   ├── overview/            # Print-friendly one-page summary (/overview)
│   │   └── admin/upload/        # Photo/project/experience CMS (ENABLE_ADMIN-gated)
│   ├── components/
│   │   ├── animations/
│   │   │   ├── NatureScene.tsx   # Fixed parallax background (sky, mountains, sun, stars)
│   │   │   ├── BirdFlock.tsx     # Animated SVG bird flocks
│   │   │   ├── FloatingLeaves.tsx # Drifting leaf particles
│   │   │   ├── SectionDivider.tsx # Organic terrain dividers with scroll parallax
│   │   │   └── ScrollProgress.tsx # Sun-to-moon scroll indicator
│   │   ├── three/
│   │   │   └── HeroScene.tsx     # WebGL 3D mountain scene, hero-only, dynamically loaded
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Transparent → frosted glass nav
│   │   │   ├── Footer.tsx        # Starlit night footer
│   │   │   ├── StorybookCursor.tsx # Nature-themed custom cursor
│   │   │   └── SmoothScroll.tsx  # Lenis smooth-scroll wrapper
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx   # Dawn — cinematic name reveal + 3D scene
│   │   │   ├── TechStackStrip.tsx # "Built with" logo strip, right after the hero
│   │   │   ├── AboutSection.tsx  # Forest Path — bio + trail timeline
│   │   │   ├── SkillsSection.tsx # Meadow — garden bed skill cards
│   │   │   ├── ProjectsSection.tsx # Stepping Stones — pinned horizontal project scroll
│   │   │   ├── PublicationsSection.tsx # Clearing — parchment cards
│   │   │   ├── PhotographySection.tsx  # Golden Hour — gallery + EXIF lightbox
│   │   │   ├── WritingSection.tsx # Field Notes — blog preview cards
│   │   │   └── ContactSection.tsx # Campfire — firefly contact form
│   │   └── ui/
│   │       ├── FloatingActionButton.tsx # Compass rose FAB
│   │       ├── CommandPalette.tsx # Cmd/Ctrl+K quick navigation
│   │       ├── ChapterMarker.tsx  # Recurring trail-flag chapter motif
│   │       └── MountainAscentHUD.tsx # Side scroll-progress trail map
│   ├── data/
│   │   ├── portfolio.ts         # Most portfolio content data
│   │   ├── projects.json        # Project entries
│   │   ├── experience.json      # Experience timeline
│   │   └── gallery.json         # Photography gallery entries
│   ├── hooks/
│   │   └── useIntersectionObserver.ts # Scroll direction + observers
│   ├── lib/
│   │   ├── utils.ts             # Utility functions (cn, throttle, etc.)
│   │   └── lenis.ts             # Shared Lenis instance + scrollTo() helper
│   └── types/
│       └── index.ts             # TypeScript interfaces
├── ROADMAP.md                    # What's pending
├── CHANGELOG.md                  # What's already shipped
└── DEVELOPMENT.md                # How this project is built/reviewed
```

## 🚀 Getting Started

```bash
# Install dependencies
cd portfolio-website
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the full dawn-to-night experience.

## 📝 Customization

### Content
Edit `src/data/portfolio.ts` to update your personal info, projects, skills, experience, and publications.

### Photography Gallery
Managed via `src/data/gallery.json`. The easiest way to add/edit photos is the built-in admin CMS at `/admin/upload` (drag-and-drop batch upload, GPS-based location auto-fill, crop/color/watermark editing, one-click commit) — set `ENABLE_ADMIN=true` locally to use it; the route 404s everywhere else unless that's set (see `DEVELOPMENT.md`).

### Colors
The nature palette is defined in `tailwind.config.js` with scales for: `dawn`, `forest`, `meadow`, `river`, `stone`, `dusk`, `night`.

## 📄 License

Built with calm focus and care.
