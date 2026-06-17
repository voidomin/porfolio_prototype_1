import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface SubProject {
  id: string;
  title: string;
  description: string;
  image: string;
  demoUrl?: string;
  technologies: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  category: string;
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  createdAt: string;
  updatedAt: string;
  subProjects?: SubProject[];
}

const getDbPath = () => path.join(process.cwd(), "src", "data", "projects.json");

// Read all projects
export async function GET() {
  try {
    const dbPath = getDbPath();
    let projects: Project[] = [];

    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, "utf-8");
      try {
        projects = JSON.parse(fileData);
      } catch (e) {
        projects = [];
      }
    }

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      longDescription,
      image,
      technologies,
      category,
      featured,
      demoUrl,
      githubUrl,
      createdAt,
      subProjects,
    } = body;

    if (!title || !description || !image || !category) {
      return NextResponse.json({ error: "Missing required project fields" }, { status: 400 });
    }

    const dbPath = getDbPath();
    let projects: Project[] = [];

    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, "utf-8");
      try {
        projects = JSON.parse(fileData);
      } catch (e) {
        projects = [];
      }
    }

    // Generate a unique ID (numbers/strings, let's use timestamp or find the max ID)
    const newId = (Math.max(...projects.map((p) => Number.parseInt(p.id) || 0), 0) + 1).toString();

    const newProject: Project = {
      id: newId,
      title,
      description,
      longDescription: longDescription || "",
      image,
      technologies: Array.isArray(technologies) ? technologies : [],
      category,
      featured: typeof featured === "boolean" ? featured : false,
      demoUrl: demoUrl || "",
      githubUrl: githubUrl || "",
      createdAt: createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      subProjects: Array.isArray(subProjects) ? subProjects : [],
    };

    projects.push(newProject);
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({ success: true, project: newProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update an existing project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      longDescription,
      image,
      technologies,
      category,
      featured,
      demoUrl,
      githubUrl,
      createdAt,
      subProjects,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Projects database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let projects: Project[] = [];
    try {
      projects = JSON.parse(fileData);
    } catch (e) {
      return NextResponse.json({ error: "Corrupted database" }, { status: 500 });
    }

    const projectIndex = projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: `Project not found: ${id}` }, { status: 404 });
    }

    const existingProject = projects[projectIndex];

    const updatedProject: Project = {
      ...existingProject,
      title: title || existingProject.title,
      description: description || existingProject.description,
      longDescription:
        typeof longDescription === "string" ? longDescription : existingProject.longDescription,
      image: image || existingProject.image,
      technologies: Array.isArray(technologies) ? technologies : existingProject.technologies,
      category: category || existingProject.category,
      featured: typeof featured === "boolean" ? featured : existingProject.featured,
      demoUrl: typeof demoUrl === "string" ? demoUrl : existingProject.demoUrl,
      githubUrl: typeof githubUrl === "string" ? githubUrl : existingProject.githubUrl,
      createdAt: createdAt || existingProject.createdAt,
      updatedAt: new Date().toISOString().split("T")[0],
      subProjects: Array.isArray(subProjects) ? subProjects : existingProject.subProjects,
    };

    projects[projectIndex] = updatedProject;
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing project id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Projects database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let projects: Project[] = [];
    try {
      projects = JSON.parse(fileData);
    } catch (e) {
      return NextResponse.json({ error: "Corrupted database" }, { status: 500 });
    }

    const projectIndex = projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) {
      return NextResponse.json({ error: `Project not found: ${id}` }, { status: 404 });
    }

    projects.splice(projectIndex, 1);
    fs.writeFileSync(dbPath, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: `Successfully deleted project: ${id}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
