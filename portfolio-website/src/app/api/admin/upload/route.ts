import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, path.extname(originalName))
    .replace(/[/\\]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base || "photo"}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const pendingDir = path.join(process.cwd(), "images-to-process");
    if (!fs.existsSync(pendingDir)) {
      fs.mkdirSync(pendingDir, { recursive: true });
    }

    const accepted: string[] = [];
    const rejected: { name: string; reason: string }[] = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        rejected.push({ name: file.name, reason: `Unsupported file type "${ext}"` });
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        rejected.push({ name: file.name, reason: "File exceeds 50MB limit" });
        continue;
      }

      let targetName = sanitizeFilename(file.name);
      let targetPath = path.join(pendingDir, targetName);
      if (fs.existsSync(targetPath)) {
        const ext2 = path.extname(targetName);
        const base2 = path.basename(targetName, ext2);
        targetName = `${base2}-${Date.now()}${ext2}`;
        targetPath = path.join(pendingDir, targetName);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(targetPath, buffer);
      accepted.push(targetName);
    }

    return NextResponse.json({ success: true, accepted, rejected });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
