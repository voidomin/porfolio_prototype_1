import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  organization: string;
  summary: string;
}

const getDbPath = () => path.join(process.cwd(), "src", "data", "experience.json");

// Read all experiences
export async function GET() {
  try {
    const dbPath = getDbPath();
    let experiences: ExperienceItem[] = [];

    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, "utf-8");
      try {
        experiences = JSON.parse(fileData);
      } catch {
        experiences = [];
      }
    }

    return NextResponse.json({ success: true, experiences });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create a new experience
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period, title, organization, summary } = body;

    if (!period || !title || !organization || !summary) {
      return NextResponse.json({ error: "Missing required experience fields" }, { status: 400 });
    }

    const dbPath = getDbPath();
    let experiences: ExperienceItem[] = [];

    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, "utf-8");
      try {
        experiences = JSON.parse(fileData);
      } catch {
        experiences = [];
      }
    }

    // Generate a unique ID
    const newId = `exp-${Date.now()}`;

    const newExperience: ExperienceItem = {
      id: newId,
      period,
      title,
      organization,
      summary,
    };

    experiences.push(newExperience);
    fs.writeFileSync(dbPath, JSON.stringify(experiences, null, 2), "utf-8");

    return NextResponse.json({ success: true, experience: newExperience });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update an existing experience
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, period, title, organization, summary } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing experience id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Experience database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let experiences: ExperienceItem[] = [];
    try {
      experiences = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: "Corrupted database" }, { status: 500 });
    }

    const expIndex = experiences.findIndex((e) => e.id === id);
    if (expIndex === -1) {
      return NextResponse.json({ error: `Experience not found: ${id}` }, { status: 404 });
    }

    const existingExp = experiences[expIndex];

    const updatedExperience: ExperienceItem = {
      ...existingExp,
      period: period || existingExp.period,
      title: title || existingExp.title,
      organization: organization || existingExp.organization,
      summary: summary || existingExp.summary,
    };

    experiences[expIndex] = updatedExperience;
    fs.writeFileSync(dbPath, JSON.stringify(experiences, null, 2), "utf-8");

    return NextResponse.json({ success: true, experience: updatedExperience });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete an experience
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing experience id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Experience database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let experiences: ExperienceItem[] = [];
    try {
      experiences = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: "Corrupted database" }, { status: 500 });
    }

    const expIndex = experiences.findIndex((e) => e.id === id);
    if (expIndex === -1) {
      return NextResponse.json({ error: `Experience not found: ${id}` }, { status: 404 });
    }

    experiences.splice(expIndex, 1);
    fs.writeFileSync(dbPath, JSON.stringify(experiences, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: `Successfully deleted experience: ${id}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
