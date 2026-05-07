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
| 6 | **Photography** | Golden Hour | Polaroid postcards (coming soon) |
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
- **Organic terrain dividers** — mountain ridges, forest treelines, rolling hills between sections
- **Nature cursor** — leaf-green custom cursor with "Explore" tooltip
- **Compass FAB** — floating compass rose for quick navigation

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom nature palette
- **Animations**: [Framer Motion](https://www.framer.com/motion/) + CSS keyframes
- **Fonts**: [Manrope](https://fonts.google.com/specimen/Manrope), [Fraunces](https://fonts.google.com/specimen/Fraunces), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📁 Project Structure

```
portfolio-website/
├── src/
│   ├── app/
│   │   ├── globals.css          # Nature theme, day-cycle variables
│   │   ├── layout.tsx           # Root layout with fonts
│   │   └── page.tsx             # Main page — assembles all chapters
│   ├── components/
│   │   ├── animations/
│   │   │   ├── NatureScene.tsx   # Fixed parallax background (sky, mountains, sun, stars)
│   │   │   ├── BirdFlock.tsx     # Animated SVG bird flocks
│   │   │   ├── FloatingLeaves.tsx # Drifting leaf particles
│   │   │   ├── SectionDivider.tsx # Organic terrain dividers
│   │   │   └── ScrollProgress.tsx # Sun-to-moon scroll indicator
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Transparent → frosted glass nav
│   │   │   ├── Footer.tsx        # Starlit night footer
│   │   │   ├── StorybookCursor.tsx # Nature-themed custom cursor
│   │   │   └── SmoothScroll.tsx  # Scroll wrapper
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx   # Dawn — cinematic name reveal
│   │   │   ├── AboutSection.tsx  # Forest Path — bio + trail timeline
│   │   │   ├── SkillsSection.tsx # Meadow — garden bed skill cards
│   │   │   ├── ProjectsSection.tsx # Stepping Stones — project grid
│   │   │   ├── PublicationsSection.tsx # Clearing — parchment cards
│   │   │   ├── PhotographySection.tsx  # Golden Hour — coming soon
│   │   │   └── ContactSection.tsx # Campfire — firefly contact form
│   │   └── ui/
│   │       └── FloatingActionButton.tsx # Compass rose FAB
│   ├── data/
│   │   └── portfolio.ts         # All portfolio content data
│   ├── hooks/
│   │   └── useIntersectionObserver.ts # Scroll direction + observers
│   ├── lib/
│   │   └── utils.ts             # Utility functions (cn, throttle, etc.)
│   └── types/
│       └── index.ts             # TypeScript interfaces
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
Add your images to `public/images/photography/` and populate the `galleryImages` array in `src/data/portfolio.ts`.

### Colors
The nature palette is defined in `tailwind.config.js` with scales for: `dawn`, `forest`, `meadow`, `river`, `stone`, `dusk`, `night`.

## 📄 License

Built with calm focus and care.
