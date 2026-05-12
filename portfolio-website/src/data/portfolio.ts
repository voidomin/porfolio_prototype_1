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
    "I build practical digital products at the intersection of software engineering, data science, and computational biology, with a quiet preference for clarity, reliability, and useful detail.",
  about:
    "I began in biotechnology and moved into software through research, product building, analytics, and engineering delivery. During my time as a research fellow at IISc Bangalore, I worked on high-performance clustered computers using structural modeling tools like Rosetta and AlphaFold to predict protein dynamics, leading to a co-authored journal publication. That path taught me to think deeply about data, structural algorithms, and reliability, which now shapes how I build products across frontend, backend, and cloud workflows.",
  aboutExtended:
    "Across my journey—from analyzing stabilizing mutations at IISc to developing software at Merck, freelancing for Param Adventures, and engineering data products at ParentOf—I have kept moving toward end-to-end engineering roles. Today, I work on robust data-driven solutions while staying open to product-minded collaborations and specialized engineering challenges.",
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
    organization: "Parent Of Solutions",
    summary:
      "Working across analytics and ML implementation, including cloud workflows, model training, deployment pipelines, and data products.",
  },
  {
    id: "exp-freelance",
    period: "Dec 2025 - Mar 2026",
    title: "Freelance Developer",
    organization: "Independent",
    summary:
      "Built and delivered the Param Adventures website for a travel company with a production-ready, highly responsive frontend.",
  },
  {
    id: "exp-merck",
    period: "Jul 2023 - Dec 2025",
    title: "Analyst -> Development Engineer",
    organization: "Merck",
    summary:
      "Started as an Analyst for the first 6 months, then converted to a full-time Development Engineer for 2 years. Developed software solutions using PHP, JavaScript, SQL, and automation workflows.",
  },
  {
    id: "exp-iisc",
    period: "Jan 2023 - Jun 2023",
    title: "Research Fellow / Computational Intern",
    organization: "Indian Institute of Science (IISc), Bangalore",
    summary:
      "Utilized clustered computing systems to understand protein dynamics. Leveraged structural biology models like Rosetta and AlphaFold to predict stabilizing mutations, contributing to co-authored research.",
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
    image: "/images/projects/projects_studio.png",
    technologies: ["React", "Vite", "UI Engineering"],
    category: "web",
    featured: true,
    demoUrl: "https://voidomin.github.io/react-projects./",
    githubUrl: "https://github.com/voidomin/react-projects",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    subProjects: [
      {
        id: "sub-vocab",
        title: "Vocab Mastery",
        description:
          "Spaced-repetition vocabulary trainer with themed decks and smooth learning loops.",
        image:
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
        demoUrl: "https://voidomin.github.io/react-projects./vocab/",
        technologies: ["React", "Firebase", "Vite"],
      },
      {
        id: "sub-caffiend",
        title: "Caffiend Tracker",
        description:
          "Caffeine monitoring app with Firebase-backed profiles and real-time intake tracking.",
        image:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
        demoUrl: "https://voidomin.github.io/react-projects./caffiend/",
        technologies: ["React", "Firebase", "Vite"],
      },
      {
        id: "sub-moviedb",
        title: "Movie Discovery",
        description:
          "Cinema-grade movie explorer with real-time search, TMDB metadata, and command palette interactions.",
        image:
          "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop",
        demoUrl: "https://voidomin.github.io/react-projects./movie-db/",
        technologies: ["React", "Vite", "TMDB API"],
      },
      {
        id: "sub-pokedex",
        title: "Pokedex Explorer",
        description:
          "Interactive Pokedex with search, type filtering, and detailed stat-rich views.",
        image:
          "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=800&h=600&fit=crop",
        demoUrl: "https://voidomin.github.io/react-projects./pokedex/",
        technologies: ["React", "Vite", "API Integration"],
      },
      {
        id: "sub-todo",
        title: "Todo Manager",
        description:
          "Streamlined task tracking app with filters, persistence, and a focus-first interface.",
        image:
          "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
        demoUrl: "https://voidomin.github.io/react-projects./todo-app/",
        technologies: ["React", "Vite"],
      },
    ],
  },
  {
    id: "2",
    title: "Mustang Pipeline",
    description:
      "Biotechnology pipeline for protein structure alignment with advanced structural analysis.",
    longDescription:
      "A Python-driven scientific workflow focused on protein alignment and RMSD analysis, deployed for practical use.",
    image: "/images/projects/mustang.png",
    technologies: ["Python", "Bioinformatics", "Streamlit"],
    category: "other",
    featured: true,
    demoUrl: "https://alignx-dcjzx4ew9nacuvxyyx5eai.streamlit.app/",
    createdAt: "2026-03-14",
    updatedAt: "2026-04-18",
  },
  {
    id: "3",
    title: "Param Adventures",
    description:
      "Production website for a travel company with immersive storytelling and conversion-focused sections.",
    longDescription:
      "Built as a freelance engagement during a transition period, with strong focus on visual flow and deployment readiness.",
    image: "/images/projects/param_adventures.png",
    technologies: ["Frontend", "Responsive Design", "Deployment"],
    category: "web",
    featured: true,
    demoUrl: "https://www.paramadventures.in/",
    createdAt: "2026-01-22",
    updatedAt: "2026-02-08",
  },
  {
    id: "4",
    title: "Smart Resume AI",
    description:
      "AI-powered resume optimizer with parsing, tailoring, and real-time feedback.",
    longDescription:
      "An intelligent platform that analyzes resumes against job descriptions, suggesting targeted improvements and keywords to pass ATS filters.",
    image: "/images/projects/resume.png",
    technologies: ["React", "TailwindCSS", "OpenAI API", "Node.js"],
    category: "web",
    featured: true,
    demoUrl: "https://resumeforge2.netlify.app/login",
    createdAt: "2026-03-20",
    updatedAt: "2026-04-22",
  },
  {
    id: "5",
    title: "Caloriq",
    description:
      "Clean, visual calorie tracker and meal logging platform with smart food search.",
    longDescription:
      "A product-minded nutrition app with a focus on quick logging, macro breakdowns, and visual history tracking.",
    image: "/images/projects/caloriq.png",
    technologies: ["React", "Vite", "Chart.js", "Firebase"],
    category: "web",
    featured: false,
    demoUrl: "https://caloriq-project.vercel.app/auth/signin",
    createdAt: "2026-03-28",
    updatedAt: "2026-04-30",
  },
];

export const blogPosts: BlogPost[] = [];

export const galleryImages: GalleryImage[] = [
  {
    id: "gal-1",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
    alt: "Mist-shrouded mountain peaks at dawn",
    title: "Alpine Awakening",
    description: "Cold morning mist creeping through a jagged mountain pass just as the first light breaks on the horizon.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: true,
    createdAt: "2026-04-10",
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      focalLength: "35mm",
      aperture: "f/8.0",
      shutterSpeed: "1/125s",
      iso: "100",
      location: "Himachal Pradesh, India",
    },
  },
  {
    id: "gal-2",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&auto=format&fit=crop&q=80",
    alt: "Light rays cutting through high pine forest canopy",
    title: "Cathedral of Trees",
    description: "Sunlight slicing through ancient redwood and cedar needles on a quiet morning in the deep forest.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: true,
    createdAt: "2026-04-12",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 16-55mm F2.8 R LM WR",
      focalLength: "18mm",
      aperture: "f/5.6",
      shutterSpeed: "1/60s",
      iso: "250",
      location: "Western Ghats, Karnataka",
    },
  },
  {
    id: "gal-3",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
    alt: "Deep valley canyon reflecting golden sunset sky",
    title: "Golden Hour Glow",
    description: "Warm amber dusk rays illuminating the valley floor as the sun dips beneath the western ridges.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: true,
    createdAt: "2026-04-15",
    exif: {
      camera: "Canon EOS R5",
      lens: "RF 15-35mm F2.8 L IS USM",
      focalLength: "24mm",
      aperture: "f/11",
      shutterSpeed: "1/15s",
      iso: "100",
      location: "Yosemite, California",
    },
  },
  {
    id: "gal-4",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
    alt: "Mountains reflecting perfectly in a glass-still lake",
    title: "Still Water Reverie",
    description: "A perfect mirror reflection of rolling mist and jagged stone peaks in a pristine alpine water body.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: false,
    createdAt: "2026-04-18",
    exif: {
      camera: "Sony Alpha 7R V",
      lens: "FE 24-70mm F2.8 GM II",
      focalLength: "50mm",
      aperture: "f/7.1",
      shutterSpeed: "1/200s",
      iso: "100",
      location: "Kashmir Great Lakes",
    },
  },
  {
    id: "gal-5",
    src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&auto=format&fit=crop&q=80",
    alt: "A crystal clear woodland river winding through mossy rocks",
    title: "Whispering Currents",
    description: "A cool mountain creek flowing over water-smoothed stones underneath an overhanging green canopy.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: false,
    createdAt: "2026-04-22",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 10-24mm F4 R OIS WR",
      focalLength: "12mm",
      aperture: "f/16",
      shutterSpeed: "1.5s",
      iso: "80",
      location: "Coorg, India",
    },
  },
  {
    id: "gal-6",
    src: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&auto=format&fit=crop&q=80",
    alt: "Milky way core stretching across mountain silouette",
    title: "A Million Worlds",
    description: "The cosmic band of the Milky Way galaxy glowing intensely above silent alpine silhouettes at midnight.",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: true,
    createdAt: "2026-04-26",
    exif: {
      camera: "Sony Alpha 7S III",
      lens: "FE 20mm F1.8 G",
      focalLength: "20mm",
      aperture: "f/1.8",
      shutterSpeed: "15s",
      iso: "3200",
      location: "Spiti Valley, Himalayas",
    },
  },
];

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
    id: "19",
    name: "Figma",
    level: 84,
    category: "design",
    color: "#F24E1E",
  },
  {
    id: "20",
    name: "Adobe Photoshop",
    level: 78,
    category: "design",
    color: "#31A8FF",
  },
  {
    id: "21",
    name: "Responsive Web Design",
    level: 85,
    category: "design",
    color: "#0EA5E9",
  },
  {
    id: "22",
    name: "Data Visualization",
    level: 82,
    category: "design",
    color: "#10B981",
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
  {
    id: "18",
    name: "Rosetta & AlphaFold",
    level: 86,
    category: "other",
    color: "#E11D48",
  },
  {
    id: "23",
    name: "Landscape Photography",
    level: 88,
    category: "hobbies",
    color: "#F59E0B",
  },
  {
    id: "24",
    name: "Acoustic Guitar & Music",
    level: 80,
    category: "hobbies",
    color: "#EC4899",
  },
  {
    id: "25",
    name: "Trekking & Mountain Hiking",
    level: 85,
    category: "hobbies",
    color: "#10B981",
  },
];
