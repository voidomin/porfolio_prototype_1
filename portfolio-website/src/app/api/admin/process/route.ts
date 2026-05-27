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

interface ImageAdjustments {
  brightness?: number; // 0.5 to 2.0
  contrast?: number;   // 0.5 to 2.0
  saturation?: number; // 0.5 to 2.0
  rotation?: number;   // 0, 90, 180, 270
}

interface WatermarkOptions {
  enabled: boolean;
  text?: string;
  position?: "southeast" | "southwest" | "northeast" | "northwest";
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
  adjustments?: ImageAdjustments;
  watermark?: WatermarkOptions;
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
      adjustments,
      watermark,
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
    const imageProcessor = sharp(inputPath);
    
    // 1. Crop
    if (crop && crop.width > 0 && crop.height > 0) {
      imageProcessor.extract({
        left: Math.round(crop.left),
        top: Math.round(crop.top),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      });
    }

    // 2. Rotation (applied after crop based on view coordinates)
    if (adjustments?.rotation !== undefined && adjustments.rotation !== 0) {
      imageProcessor.rotate(adjustments.rotation);
    }

    // 3. Brightness & Saturation modulation
    if (adjustments) {
      const modulateOpts: { brightness?: number; saturation?: number } = {};
      if (adjustments.brightness !== undefined) modulateOpts.brightness = adjustments.brightness;
      if (adjustments.saturation !== undefined) modulateOpts.saturation = adjustments.saturation;
      if (Object.keys(modulateOpts).length > 0) {
        imageProcessor.modulate(modulateOpts);
      }
    }

    // 4. Contrast modulation (linear transform centered around 128 for 8-bit dynamic range)
    if (adjustments?.contrast !== undefined && adjustments.contrast !== 1.0) {
      const C = adjustments.contrast;
      imageProcessor.linear(C, 128 * (1 - C));
    }

    // 5. Resize to max 1920px width (maintaining aspect ratio)
    imageProcessor.resize({ width: 1920, withoutEnlargement: true });

    // 6. Signature watermark overlay compositing
    if (watermark?.enabled) {
      const watermarkText = watermark.text || "© Akash Photography";
      const svgWidth = 500;
      const svgHeight = 80;
      
      // Determine text anchor and alignment coordinates based on gravity position
      const isWest = watermark.position === "southwest" || watermark.position === "northwest";
      const textAnchor = isWest ? "start" : "end";
      const textX = isWest ? 20 : 480;

      const svg = `
        <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <style>
            .watermark-text {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              font-size: 16px;
              font-weight: 500;
              letter-spacing: 0.15em;
              fill: #ffffff;
              fill-opacity: 0.45;
              text-anchor: ${textAnchor};
            }
          </style>
          <text x="${textX}" y="45" class="watermark-text" style="text-shadow: 0px 1px 3px rgba(0,0,0,0.5);">${watermarkText}</text>
        </svg>
      `;
      const watermarkBuffer = Buffer.from(svg);
      imageProcessor.composite([
        {
          input: watermarkBuffer,
          gravity: watermark.position || "southeast",
        }
      ]);
    }

    // 7. Output WebP
    const imageInfo = await imageProcessor
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
