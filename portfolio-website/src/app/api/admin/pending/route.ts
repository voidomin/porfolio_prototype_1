import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), "images-to-process");
    
    // Auto-create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    if (!fs.existsSync(path.join(dirPath, "imported"))) {
      fs.mkdirSync(path.join(dirPath, "imported"), { recursive: true });
    }

    const files = fs.readdirSync(dirPath);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    
    const pendingImages = files.filter(file => {
      const filePath = path.join(dirPath, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      if (isDirectory) return false;
      
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    return NextResponse.json({ files: pendingImages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
