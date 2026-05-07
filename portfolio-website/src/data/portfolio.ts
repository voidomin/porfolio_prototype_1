import {
  Project,
  Publication,
  BlogPost,
  GalleryImage,
  Skill,
  NavigationItem,
  SocialLink,
  PersonalProfile,
  ExperienceItem,
} from "@/types";

export const personalProfile: PersonalProfile = {
  name: "Akash",
  headline: "Full-Stack & Data Science Engineer",
  location: "Bangalore, India",
  intro:
    "I build practical digital products at the intersection of software engineering and data science, with a quiet preference for clarity, reliability, and useful detail.",
  about:
    "I began in biotechnology and moved into software through product building, analytics, and engineering delivery. That path taught me to think carefully about data, implementation, and reliability, which now shapes how I build products across frontend, backend, and cloud workflows.",
  aboutExtended:
    "Across roles, I have kept moving toward work that feels both practical and meaningful: turning ideas into usable products, making systems more dependable, and keeping the experience calm for the person using it. Today, I work on data-driven solutions while staying open to end-to-end engineering roles and product-minded collaborations.",
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Photography", href: "#photography" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/voidomin",
    icon: "github",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/akash-bhat-930346197",
    icon: "linkedin",
  },
];

export const contactInfo = {
  email: "akashkbhat2001@gmail.com",
  phone: "",
  location: "Bangalore, India",
};

export const aboutStats = [
  { label: "Years in Industry", value: "2+" },
  { label: "Production Projects", value: "9+" },
  { label: "Domains Worked", value: "4" },
  { label: "Core Focus", value: "Data + Product" },
];

export const experienceTimeline: ExperienceItem[] = [
  {
    id: "exp-parentof",
    period: "Mar 2026 - Present",
    title: "Data Analyst -> Data Science Engineer",
    organization: "Parent Of",
    summary:
      "Working across analytics and ML implementation, including cloud workflows, model training, deployment pipelines, and data products.",
  },
  {
    id: "exp-freelance",
    period: "Dec 2025 - Mar 2026",
    title: "Freelance Developer",
    organization: "Independent",
    summary:
      "Built and delivered the Param Adventures website for a travel company with a production-ready frontend.",
  },
  {
    id: "exp-merck",
    period: "Jan 2024 - Dec 2025",
    title: "Analyst -> Test Engineer -> Development Engineer",
    organization: "Merck",
    summary:
      "Started with analytics, moved into testing, then software development using PHP, JavaScript, SQL tooling, and CI/CD workflows.",
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "React Projects Studio",
    description:
      "A curated ecosystem of React + Vite builds demonstrating polished UI, modular architecture, and focused product craft.",
    longDescription:
      "A portfolio umbrella showcasing multiple shipped applications with cohesive design language and practical functionality.",
    image:
      "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=800&h=600&fit=crop",
    technologies: ["React", "Vite", "UI Engineering"],
    category: "web",
    featured: true,
    demoUrl: "https://voidomin.github.io/react-projects./",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
  },
  {
    id: "2",
    title: "Vocab Mastery",
    description:
      "Spaced-repetition vocabulary trainer with themed decks and smooth learning loops.",
    longDescription:
      "Built as a focused learning product with clean interactions and practical retention features.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
    technologies: ["React", "Firebase", "Vite"],
    category: "web",
    featured: true,
    demoUrl: "https://voidomin.github.io/react-projects./vocab/",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-02-01",
    updatedAt: "2026-03-10",
  },
  {
    id: "3",
    title: "Todo Manager",
    description:
      "Streamlined task tracking app with filters, persistence, and a focus-first interface.",
    longDescription:
      "A compact productivity app built around quick task capture and status-based workflows.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
    technologies: ["React", "Vite"],
    category: "web",
    featured: false,
    demoUrl: "https://voidomin.github.io/react-projects./todo-app/",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-02-12",
    updatedAt: "2026-03-16",
  },
  {
    id: "4",
    title: "Pokedex Explorer",
    description:
      "Interactive Pokedex with search, type filtering, and detailed stat-rich views.",
    longDescription:
      "A data-heavy frontend experience designed for browsing and comparing large sets of Pokemon entries.",
    image:
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop",
    technologies: ["React", "Vite", "API Integration"],
    category: "web",
    featured: false,
    demoUrl: "https://voidomin.github.io/react-projects./pokedex/",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-02-18",
    updatedAt: "2026-04-02",
  },
  {
    id: "5",
    title: "Caffiend Tracker",
    description:
      "Caffeine monitoring app with Firebase-backed profiles and real-time intake tracking.",
    longDescription:
      "A health-focused tracker that combines practical daily logging with charts and history for better habit awareness.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    technologies: ["React", "Firebase", "Vite"],
    category: "web",
    featured: true,
    demoUrl: "https://voidomin.github.io/react-projects./caffiend/",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-02-24",
    updatedAt: "2026-04-10",
  },
  {
    id: "6",
    title: "Movie Discovery",
    description:
      "Cinema-grade movie explorer with real-time search, TMDB metadata, and command palette interactions.",
    longDescription:
      "A polished browsing and discovery experience that blends dense movie data with performant UI workflows.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
    technologies: ["React", "Vite", "TMDB API"],
    category: "web",
    featured: true,
    demoUrl: "https://voidomin.github.io/react-projects./movie-db/",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-03-05",
    updatedAt: "2026-04-16",
  },
  {
    id: "7",
    title: "Mustang Pipeline",
    description:
      "Biotechnology pipeline for protein structure alignment with advanced structural analysis.",
    longDescription:
      "A Python-driven scientific workflow focused on protein alignment and RMSD analysis, deployed for practical use.",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=600&fit=crop",
    technologies: ["Python", "Bioinformatics", "Streamlit"],
    category: "other",
    featured: true,
    demoUrl: "https://alignx-dcjzx4ew9nacuvxyyx5eai.streamlit.app/",
    createdAt: "2026-03-14",
    updatedAt: "2026-04-18",
  },
  {
    id: "8",
    title: "Param Adventures",
    description:
      "Production website for a travel company with immersive storytelling and conversion-focused sections.",
    longDescription:
      "Built as a freelance engagement during a transition period, with strong focus on visual flow and deployment readiness.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    technologies: ["Frontend", "Responsive Design", "Deployment"],
    category: "web",
    featured: true,
    demoUrl: "https://www.paramadventures.in/",
    createdAt: "2026-01-22",
    updatedAt: "2026-02-08",
  },
];

export const blogPosts: BlogPost[] = [];

export const galleryImages: GalleryImage[] = [];

export const publications: Publication[] = [
  {
    id: "pub-1",
    title:
      "Improved Prediction of Stabilizing Mutations in Proteins by Incorporation of Mutational Effects on Ligand Binding",
    authors: [
      "Srivarshini Ganesan",
      "Nidhi Mittal",
      "Akash Bhat",
      "Rachana S. Adiga",
      "Ananthakrishnan Ganesan",
      "Deepesh Nagarajan",
      "Raghavan Varadarajan",
    ],
    venue: "Proteins: Structure, Function, and Bioinformatics",
    year: 2024,
    type: "journal",
    link: "https://onlinelibrary.wiley.com/doi/abs/10.1002/prot.26738",
    citation: "First published: 21 August 2024 · DOI: 10.1002/prot.26738",
    abstract:
      "This study shows how incorporating mutational effects on ligand binding improves the prediction of stabilizing protein mutations. On the CcdB test case, computational predictors such as ThermoMPNN performed best among the tested methods, but the strongest gains came from combining computational scoring with high-throughput experimental binding data. The result is a more practical route to identifying stabilizing mutations with higher precision and less experimental overhead.",
    featured: true,
  },
];

export const skills: Skill[] = [
  {
    id: "1",
    name: "JavaScript",
    level: 88,
    category: "frontend",
    color: "#F7DF1E",
  },
  {
    id: "2",
    name: "HTML",
    level: 90,
    category: "frontend",
    color: "#E34F26",
  },
  {
    id: "3",
    name: "CSS",
    level: 86,
    category: "frontend",
    color: "#1572B6",
  },
  {
    id: "4",
    name: "Frontend Architecture",
    level: 85,
    category: "frontend",
    color: "#0EA5E9",
  },
  {
    id: "5",
    name: "PHP",
    level: 82,
    category: "backend",
    color: "#777BB4",
  },
  {
    id: "6",
    name: "APIs",
    level: 84,
    category: "backend",
    color: "#0F766E",
  },
  {
    id: "7",
    name: "SQL",
    level: 86,
    category: "backend",
    color: "#1D4ED8",
  },
  {
    id: "8",
    name: "PostgreSQL",
    level: 82,
    category: "backend",
    color: "#336791",
  },
  {
    id: "9",
    name: "UI/UX Design",
    level: 80,
    category: "design",
    color: "#7C3AED",
  },
  {
    id: "10",
    name: "Product Thinking",
    level: 78,
    category: "design",
    color: "#14B8A6",
  },
  {
    id: "11",
    name: "GitHub",
    level: 90,
    category: "tools",
    color: "#111827",
  },
  { id: "12", name: "GCP", level: 78, category: "tools", color: "#4285F4" },
  { id: "13", name: "Azure", level: 72, category: "tools", color: "#0078D4" },
  { id: "14", name: "Bash", level: 76, category: "tools", color: "#16A34A" },
  { id: "15", name: "Excel", level: 84, category: "tools", color: "#0EA5E9" },
  {
    id: "16",
    name: "Google Analytics",
    level: 74,
    category: "tools",
    color: "#F97316",
  },
  {
    id: "17",
    name: "Data Structures & Algorithms",
    level: 80,
    category: "other",
    color: "#DC2626",
  },
];
