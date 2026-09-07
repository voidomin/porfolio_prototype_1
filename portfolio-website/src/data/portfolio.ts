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
  Testimonial,
} from "@/types";

export const personalProfile: PersonalProfile = {
  name: "Akash",
  headline: "Full-Stack & Data Science Engineer",
  location: "Bangalore, India",
  intro:
    "I build practical digital products where software engineering meets data science and computational biology — with a quiet preference for clarity and reliability.",
  about:
    "I began in biotechnology and moved into software through research, product building, analytics, and engineering delivery. During my time as a research fellow at IISc Bangalore, I worked on high-performance clustered computers using structural modeling tools like Rosetta and AlphaFold to predict protein dynamics, leading to a co-authored journal publication. That path taught me to think deeply about data, structural algorithms, and reliability, which now shapes how I build products across frontend, backend, and cloud workflows.",
  aboutExtended:
    "Across my journey—from analyzing stabilizing mutations at IISc to developing software at Merck, freelancing for Param Adventures, and engineering data products at ParentOf—I have kept moving toward end-to-end engineering roles. Today, I work on robust data-driven solutions while staying open to product-minded collaborations and specialized engineering challenges.",
  avatar: "/images/avatar.png",
  tags: ["Data + Craft", "Mountain calm", "Full-Stack", "Dawn trails"],
  openToWork: true,
};

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Publications", href: "#publications" },
  { label: "Photography", href: "#photography" },
  { label: "Writing", href: "#writing" },
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

import experienceData from "./experience.json";
export const experienceTimeline: ExperienceItem[] = experienceData;

import projectsData from "./projects.json";
export const projects: Project[] = projectsData;

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "trusting-a-single-signal",
    title: "What a Hundred Mutations Taught Me About Trusting a Single Answer",
    excerpt:
      "Before I wrote a line of production code, I spent months mutating a single protein, one amino acid at a time, across a row of Linux machines at IISc. The lesson from that project still shapes how I build software today.",
    content:
      "Before I was an engineer, I was mutating a protein called CcdB, one amino acid at a time, on a row of four Linux cluster machines in a lab at the Indian Institute of Science.\n\nCcdB is small as proteins go, about a hundred amino acids long. The question we were asking was simple to state and hard to answer. If you change one amino acid, does the protein get more stable, less stable, or does it stop folding properly altogether? Multiply that question by every position in the sequence and you get roughly a hundred separate experiments, each one needing its own simulation run.\n\nThe day to day was pretty unglamorous. I'd log into the cluster, kick off a batch of Rosetta jobs, one for each candidate mutation at a given position, and then wait. Rosetta would model what happens structurally when you swap in that one amino acid. Does it clash with its neighbors. Does it break a hydrogen bond that was holding the fold together. Does it destabilize the whole thing. Do that across a hundred positions and you end up with a huge pile of per residue output to go through.\n\nThe actual finding, once it came together into a paper two years later, was more interesting than just \"run Rosetta and read the numbers.\" We tested several computational predictors against real experimental binding data, and a newer method called ThermoMPNN came out ahead of the rest. But even the best computational predictor on its own wasn't the full answer. The biggest gains in accuracy came from combining the computational scoring with high throughput experimental binding measurements. Neither one alone told the whole story. Together they gave a more practical way to find stabilizing mutations without having to test every single possibility in the wet lab.\n\nThat's stuck with me longer than the actual biology has. I don't fully trust a single signal anymore, wherever it comes from. A model's confidence score, a test suite going green, one metric on a dashboard, none of these tell the whole story on their own, the same way ThermoMPNN alone didn't. What I took from that cluster room is to look for a second, independently derived signal before I believe the first one. It's slower. It's also the only way I've found that actually holds up over time.\n\nI don't run Rosetta jobs anymore. But somewhere underneath the frontend work and the data pipelines, there's still a research fellow waiting for a hundred simulations to finish, learning to be patient with a slow careful process instead of a fast confident one that might just be wrong.",
    image: "/images/blog/protein-research",
    author: personalProfile.name,
    category: "personal",
    tags: ["research", "computational biology", "career reflection"],
    publishedAt: "2026-09-03",
    updatedAt: "2026-09-03",
    readingTime: 4,
    featured: true,
  },
];

export const testimonials: Testimonial[] = [];

import galleryData from "./gallery.json";

export const galleryImages: GalleryImage[] = galleryData;

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
];

export const hobbies: string[] = [
  "Landscape Photography",
  "Acoustic Guitar & Music",
  "Trekking & Mountain Hiking",
];
