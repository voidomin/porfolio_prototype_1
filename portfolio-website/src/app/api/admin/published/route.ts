import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Exif definition matches the ExifData interface
interface ExifMetadata {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  location?: string;
}

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  category: string;
  width: number;
  height: number;
  featured: boolean;
  createdAt: string;
  exif?: ExifMetadata;
}

const getDbPath = () => path.join(process.cwd(), "src", "data", "gallery.json");

// Fetch all published photos from gallery.json
export async function GET() {
  try {
    const dbPath = getDbPath();
    let gallery: GalleryItem[] = [];

    if (fs.existsSync(dbPath)) {
      const fileData = fs.readFileSync(dbPath, "utf-8");
      try {
        gallery = JSON.parse(fileData);
      } catch {
        gallery = [];
      }
    }

    return NextResponse.json({ success: true, photos: gallery });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update metadata of a published photo
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, alt, description, category, featured, createdAt, exif } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing photo id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Gallery database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let gallery: GalleryItem[] = [];
    try {
      gallery = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: "Corrupted gallery database" }, { status: 500 });
    }

    const photoIndex = gallery.findIndex((photo) => photo.id === id);
    if (photoIndex === -1) {
      return NextResponse.json({ error: `Photo not found: ${id}` }, { status: 404 });
    }

    // Retain dimensions and source but overwrite metadata
    const existingPhoto = gallery[photoIndex];
    const updatedExif = {
      camera: exif?.camera || "",
      lens: exif?.lens || "",
      focalLength: exif?.focalLength || "",
      aperture: exif?.aperture || "",
      shutterSpeed: exif?.shutterSpeed || "",
      iso: exif?.iso || "",
      location: exif?.location || "",
    };

    const hasExif = Object.values(updatedExif).some((val) => val !== "");

    const updatedPhoto: GalleryItem = {
      ...existingPhoto,
      title: title || existingPhoto.title,
      alt: alt || existingPhoto.alt,
      description: description ?? existingPhoto.description,
      category: category || existingPhoto.category,
      featured: typeof featured === "boolean" ? featured : existingPhoto.featured,
      createdAt: createdAt || existingPhoto.createdAt,
      exif: hasExif ? updatedExif : undefined,
    };

    // Clean up empty exif block if not present
    if (!hasExif) {
      delete updatedPhoto.exif;
    }

    gallery[photoIndex] = updatedPhoto;
    fs.writeFileSync(dbPath, JSON.stringify(gallery, null, 2), "utf-8");

    return NextResponse.json({ success: true, photo: updatedPhoto });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a photo from gallery.json and remove its webp asset from public directory
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing photo id" }, { status: 400 });
    }

    const dbPath = getDbPath();
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "Gallery database does not exist" }, { status: 404 });
    }

    const fileData = fs.readFileSync(dbPath, "utf-8");
    let gallery: GalleryItem[] = [];
    try {
      gallery = JSON.parse(fileData);
    } catch {
      return NextResponse.json({ error: "Corrupted gallery database" }, { status: 500 });
    }

    const photoIndex = gallery.findIndex((photo) => photo.id === id);
    if (photoIndex === -1) {
      return NextResponse.json({ error: `Photo not found: ${id}` }, { status: 404 });
    }

    // Delete static WebP file if it exists in public directory
    const imagePath = path.join(process.cwd(), "public", "images", "photography", `${id}.webp`);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.warn(`Could not delete physical WebP file for ${id}:`, err);
      }
    }

    // Remove entry and write JSON back
    gallery.splice(photoIndex, 1);
    fs.writeFileSync(dbPath, JSON.stringify(gallery, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: `Successfully deleted photo: ${id}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
