export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  technologies: string[];
  category: string;
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  slug: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  category: string;
  width: number;
  height: number;
  featured: boolean;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  color?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface PersonalProfile {
  name: string;
  headline: string;
  location: string;
  intro: string;
  about: string;
  aboutExtended: string;
}

export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  summary: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  type: "journal" | "conference" | "book" | "preprint" | "other";
  link?: string;
  citation?: string;
  abstract?: string;
  featured: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  image?: string;
  url?: string;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export interface ParticleConfig {
  count: number;
  speed: number;
  size: {
    min: number;
    max: number;
  };
  color: string;
  opacity: {
    min: number;
    max: number;
  };
  connections: boolean;
  connectionDistance: number;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
}

export type ProjectCategory = "web" | "mobile" | "design" | "other";
export type BlogCategory = "tech" | "design" | "personal" | "tutorial";
export type GalleryCategory =
  | "nature"
  | "portrait"
  | "street"
  | "architecture"
  | "other";
export type SkillCategory =
  | "frontend"
  | "backend"
  | "design"
  | "tools"
  | "other";

export interface FABAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  color?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  progress?: number;
}

export interface ScrollProgress {
  progress: number;
  direction: "up" | "down";
  isAtTop: boolean;
  isAtBottom: boolean;
}
