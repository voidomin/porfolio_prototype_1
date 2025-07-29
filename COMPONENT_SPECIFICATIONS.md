# Component Specifications & Animation Details

## 🎬 Animation Library Integration

### GSAP Timeline Configurations

```javascript
// Master timeline for page load
const masterTL = gsap.timeline({ paused: true });

// Hero section timeline
const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
  },
});
```

### Framer Motion Variants

```javascript
// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Stagger children animation
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
```

## 🏠 Hero Section Components

### 1. AnimatedTypography Component

```typescript
interface AnimatedTypographyProps {
  text: string;
  variant: "hero" | "subtitle" | "accent";
  delay?: number;
  duration?: number;
}
```

**Animation Specifications:**

- **Text Reveal**: Characters animate in with staggered timing
- **Typewriter Effect**: Cursor blinks with realistic typing speed
- **Glitch Effect**: Subtle digital distortion on hover
- **Gradient Animation**: Text color shifts through spectrum

**Implementation Details:**

- Split text into individual characters/words
- GSAP timeline with staggered delays
- CSS custom properties for dynamic colors
- Hardware acceleration with transform3d

### 2. ParticleBackground Component

```typescript
interface ParticleBackgroundProps {
  density: number;
  speed: number;
  interactive: boolean;
  theme: "light" | "dark";
}
```

**Animation Specifications:**

- **Floating Particles**: Smooth Brownian motion
- **Mouse Interaction**: Particles attracted to cursor
- **Connection Lines**: Dynamic lines between nearby particles
- **Depth Layers**: Multiple z-index layers for parallax

### 3. ScrollIndicator Component

```typescript
interface ScrollIndicatorProps {
  position: "center" | "right";
  animated: boolean;
  hideOnScroll: boolean;
}
```

**Animation Specifications:**

- **Bounce Animation**: Subtle up/down movement
- **Fade Out**: Disappears after first scroll
- **Pulse Effect**: Gentle scale animation
- **Arrow Animation**: Morphing arrow shapes

## 🧭 Navigation Components

### 1. AnimatedNavbar Component

```typescript
interface AnimatedNavbarProps {
  variant: "transparent" | "solid" | "blur";
  hideOnScroll: boolean;
  showProgress: boolean;
}
```

**Animation Specifications:**

- **Slide In**: Navbar slides down on page load
- **Background Blur**: Backdrop-filter blur on scroll
- **Logo Animation**: Morphing logo states
- **Menu Toggle**: Hamburger to X transformation

**Micro-interactions:**

- Link hover: Underline grows from center
- Active state: Glowing border animation
- Mobile menu: Staggered item animations
- Scroll progress: Animated progress bar

### 2. MobileMenu Component

```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavigationItem[];
}
```

**Animation Specifications:**

- **Overlay**: Smooth backdrop fade-in
- **Menu Slide**: Panel slides from right/top
- **Item Stagger**: Menu items animate in sequence
- **Close Animation**: Reverse animation on close

## 🎨 Project Showcase Components

### 1. ProjectGrid Component

```typescript
interface ProjectGridProps {
  projects: Project[];
  layout: "masonry" | "grid" | "carousel";
  filterEnabled: boolean;
}
```

**Animation Specifications:**

- **Grid Entrance**: Items fade in with stagger
- **Hover Effects**: Scale + shadow + overlay
- **Filter Transitions**: Smooth layout changes
- **Loading States**: Skeleton animations

### 2. ProjectCard Component

```typescript
interface ProjectCardProps {
  project: Project;
  variant: "default" | "featured" | "minimal";
  hoverEffect: "lift" | "tilt" | "zoom";
}
```

**Animation Specifications:**

- **Image Hover**: Subtle zoom with overlay
- **Text Reveal**: Title/description slide up
- **Tag Animation**: Tags appear with stagger
- **CTA Button**: Morphing button states

**Hover Timeline:**

1. Image scales to 1.05x (300ms)
2. Overlay fades in (200ms)
3. Text slides up (250ms)
4. Button transforms (150ms)

### 3. ProjectModal Component

```typescript
interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}
```

**Animation Specifications:**

- **Modal Entrance**: Scale from 0.8 to 1.0
- **Backdrop**: Smooth blur and darken
- **Content Stagger**: Elements animate in sequence
- **Image Gallery**: Smooth carousel transitions

## 📸 Photography Gallery Components

### 1. MasonryGallery Component

```typescript
interface MasonryGalleryProps {
  images: GalleryImage[];
  columns: { mobile: number; tablet: number; desktop: number };
  spacing: number;
}
```

**Animation Specifications:**

- **Masonry Layout**: Smooth repositioning on resize
- **Image Loading**: Blur-up placeholder effect
- **Hover States**: Subtle scale and overlay
- **Lightbox Trigger**: Smooth zoom transition

### 2. Lightbox Component

```typescript
interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
}
```

**Animation Specifications:**

- **Open Animation**: Image zooms from thumbnail
- **Navigation**: Smooth slide transitions
- **Zoom Controls**: Pinch-to-zoom support
- **Close Animation**: Zoom back to thumbnail

**Gesture Support:**

- Swipe navigation on mobile
- Pinch-to-zoom functionality
- Double-tap to zoom
- Keyboard navigation

## 📝 Blog Components

### 1. BlogGrid Component

```typescript
interface BlogGridProps {
  posts: BlogPost[];
  layout: "grid" | "list" | "featured";
  pagination: boolean;
}
```

**Animation Specifications:**

- **Card Entrance**: Staggered fade-in-up
- **Hover Effects**: Subtle lift and shadow
- **Loading More**: Smooth content insertion
- **Filter Animation**: Layout transitions

### 2. BlogPost Component

```typescript
interface BlogPostProps {
  post: BlogPost;
  showExcerpt: boolean;
  readingTime: boolean;
}
```

**Animation Specifications:**

- **Image Hover**: Parallax effect on scroll
- **Text Reveal**: Progressive text appearance
- **Read More**: Expanding content area
- **Share Buttons**: Floating action animations

### 3. ReadingProgress Component

```typescript
interface ReadingProgressProps {
  target: string;
  position: "top" | "side";
  showPercentage: boolean;
}
```

**Animation Specifications:**

- **Progress Bar**: Smooth width transitions
- **Percentage Counter**: Animated number counting
- **Milestone Markers**: Chapter progress indicators
- **Completion Celebration**: Subtle success animation

## 🎯 Interactive Elements

### 1. SkillBars Component

```typescript
interface SkillBarsProps {
  skills: Skill[];
  animateOnView: boolean;
  showPercentage: boolean;
}
```

**Animation Specifications:**

- **Bar Fill**: Smooth width animation with easing
- **Percentage Count**: Number counting animation
- **Icon Animation**: Skill icons bounce in
- **Stagger Effect**: Bars animate in sequence

### 2. ContactForm Component

```typescript
interface ContactFormProps {
  onSubmit: (data: FormData) => void;
  showValidation: boolean;
  animatedLabels: boolean;
}
```

**Animation Specifications:**

- **Label Float**: Labels float up on focus
- **Validation Feedback**: Error/success animations
- **Submit Button**: Loading state transformations
- **Success State**: Celebration micro-animation

**Form Validation Animations:**

- Error shake: Input field shakes on error
- Success checkmark: Smooth checkmark draw
- Loading spinner: Button morphs to spinner
- Field highlighting: Border color transitions

### 3. FloatingActionButton Component

```typescript
interface FloatingActionButtonProps {
  actions: FABAction[];
  position: "bottom-right" | "bottom-left";
  expandDirection: "up" | "left";
}
```

**Animation Specifications:**

- **Main Button**: Pulse animation on idle
- **Menu Expansion**: Radial menu animation
- **Icon Morphing**: Plus to X transformation
- **Tooltip Reveal**: Smooth tooltip animations

## 🌙 Theme System Components

### 1. ThemeToggle Component

```typescript
interface ThemeToggleProps {
  variant: "switch" | "button" | "icon";
  showLabel: boolean;
  position: "header" | "floating";
}
```

**Animation Specifications:**

- **Toggle Switch**: Smooth slider movement
- **Icon Morph**: Sun to moon transformation
- **Color Transition**: Smooth theme color changes
- **Ripple Effect**: Click feedback animation

**Theme Transition Timeline:**

1. Background color fade (400ms)
2. Text color transition (300ms)
3. Border color updates (200ms)
4. Shadow adjustments (250ms)

## 🎪 Particle & Background Effects

### 1. GeometricBackground Component

```typescript
interface GeometricBackgroundProps {
  shapes: "triangles" | "circles" | "polygons";
  density: number;
  animationSpeed: number;
}
```

**Animation Specifications:**

- **Shape Movement**: Slow floating motion
- **Rotation**: Gentle rotation animations
- **Opacity Pulse**: Breathing effect
- **Mouse Interaction**: Shapes respond to cursor

### 2. ParallaxSection Component

```typescript
interface ParallaxSectionProps {
  speed: number;
  direction: "up" | "down" | "left" | "right";
  children: React.ReactNode;
}
```

**Animation Specifications:**

- **Scroll Transform**: Element moves at different speed
- **Opacity Change**: Fade based on scroll position
- **Scale Effect**: Subtle scaling on scroll
- **Rotation**: Gentle rotation based on scroll

## 📱 Responsive Animation Adaptations

### Mobile Optimizations

- Reduced particle density for performance
- Simplified hover states (tap-based)
- Touch-friendly gesture support
- Optimized animation durations

### Tablet Adaptations

- Medium complexity animations
- Touch and mouse support
- Responsive grid layouts
- Optimized image sizes

### Desktop Enhancements

- Full animation complexity
- Advanced hover effects
- Keyboard navigation support
- High-resolution assets

## ⚡ Performance Considerations

### Animation Performance Rules

1. Use `transform` and `opacity` only for 60fps
2. Apply `will-change` property strategically
3. Clean up animations on component unmount
4. Respect `prefers-reduced-motion` settings

### Memory Management

- Dispose of GSAP timelines properly
- Remove event listeners on cleanup
- Optimize image loading and caching
- Use React.memo for expensive components

This specification provides the detailed blueprint for implementing each component with stunning animations while maintaining optimal performance across all devices.
