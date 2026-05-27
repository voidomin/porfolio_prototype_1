import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

interface ExifMetadata {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
}

interface CropCoordinates {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ProcessRequestBody {
  filename: string;
  id: string;
  title: string;
  alt: string;
  description: string;
  category: string;
  featured: boolean;
  createdAt: string;
  exif: ExifMetadata;
  crop?: CropCoordinates;
}

export async function POST(request: NextRequest) {
  try {
    const body: ProcessRequestBody = await request.json();
    const {
      filename,
      id,
      title,
      alt,
      description,
      category,
      featured,
      createdAt,
      exif,
      crop,
    } = body;

    // Validate inputs
    if (!filename || !id || !category) {
      return NextResponse.json({ error: "Missing required fields: filename, id, category" }, { status: 400 });
    }

    const pendingDir = path.join(process.cwd(), "images-to-process");
    const inputPath = path.join(pendingDir, filename);

    if (!fs.existsSync(inputPath)) {
      return NextResponse.json({ error: `File not found: ${filename}` }, { status: 404 });
    }

    // Prepare outputs paths
    const outputDir = path.join(process.cwd(), "public", "images", "photography");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFilename = `${id}.webp`;
    const outputPath = path.join(outputDir, outputFilename);
    const webpSrcPath = `/images/photography/${outputFilename}`;

    // Process image using sharp: extract crop if specified, resize to max 1920 width, convert to webp (quality 82)
    // withoutEnlargement: true prevents upscaling smaller images
    const imageProcessor = sharp(inputPath);
    if (crop && crop.width > 0 && crop.height > 0) {
      imageProcessor.extract({
        left: Math.round(crop.left),
        top: Math.round(crop.top),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      });
    }

    const imageInfo = await imageProcessor
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath);

    // Read and update gallery.json
    const dbPath = path.join(process.cwd(), "src", "data", "gallery.json");
    let gallery: any[] = [];
    if (fs.existsSync(dbPath)) {
      try {
        gallery = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      } catch (e) {
        gallery = [];
      }
    }

    // Check for duplicate ID
    const duplicateIndex = gallery.findIndex(item => item.id === id);
    
    const newImageEntry = {
      id,
      src: webpSrcPath,
      alt: alt || title || "Photography upload",
      title: title || "Untitled",
      description: description || "",
      category: category,
      width: imageInfo.width,
      height: imageInfo.height,
      featured: !!featured,
      createdAt: createdAt || new Date().toISOString().split("T")[0],
      exif: {
        camera: exif?.camera || "",
        lens: exif?.lens || "",
        focalLength: exif?.focalLength || "",
        aperture: exif?.aperture || "",
        shutterSpeed: exif?.shutterSpeed || "",
        iso: exif?.iso || "",
        location: exif?.location || "",
      }
    };

    // Filter out empty exif metadata block if no exif is specified
    const hasExif = Object.values(newImageEntry.exif).some(val => val !== "");
    if (!hasExif) {
      delete (newImageEntry as any).exif;
    }

    if (duplicateIndex !== -1) {
      gallery[duplicateIndex] = newImageEntry; // Update existing entry
    } else {
      gallery.unshift(newImageEntry); // Add to the beginning of the gallery list (newest first)
    }

    // Write back to gallery.json
    fs.writeFileSync(dbPath, JSON.stringify(gallery, null, 2), "utf-8");

    // Move raw file to imported folder to keep things clean
    const importedDir = path.join(pendingDir, "imported");
    if (!fs.existsSync(importedDir)) {
      fs.mkdirSync(importedDir, { recursive: true });
    }
    const archivePath = path.join(importedDir, filename);
    
    // If a file with the same name already exists in archive, append timestamp to avoid overwrite error
    let finalArchivePath = archivePath;
    if (fs.existsSync(archivePath)) {
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      finalArchivePath = path.join(importedDir, `${base}-${Date.now()}${ext}`);
    }

    fs.renameSync(inputPath, finalArchivePath);

    return NextResponse.json({ success: true, entry: newImageEntry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
