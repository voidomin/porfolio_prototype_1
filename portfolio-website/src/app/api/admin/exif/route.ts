import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import exifr from "exifr";

function formatShutterSpeed(seconds: number | undefined): string {
  if (seconds === undefined) return "";
  if (seconds >= 0.9) {
    return `${Math.round(seconds * 10) / 10}s`;
  }
  const denominator = Math.round(1 / seconds);
  return `1/${denominator}s`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "images-to-process");
    const filePath = path.join(dirPath, filename);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read EXIF metadata using exifr
    const exifData = await exifr
      .parse(filePath, {
        tiff: true,
        xmp: true,
        gps: true,
        exif: true,
      })
      .catch(() => null);

    const stats = fs.statSync(filePath);

    // Format fields
    const camera = exifData?.Model || exifData?.Make || "";
    const lens = exifData?.LensModel || exifData?.LensInfo || "";
    const focalLength = exifData?.FocalLength ? `${exifData.FocalLength}mm` : "";
    const aperture = exifData?.FNumber ? `f/${exifData.FNumber}` : "";
    const shutterSpeed = formatShutterSpeed(exifData?.ExposureTime);
    const iso = exifData?.ISOSpeedRatings ? String(exifData.ISOSpeedRatings) : "";

    // Format Date: DateTimeOriginal, or fallback to file creation date
    let captureDate = "";
    if (exifData?.DateTimeOriginal) {
      const dateObj = new Date(exifData.DateTimeOriginal);
      if (!isNaN(dateObj.getTime())) {
        captureDate = dateObj.toISOString().split("T")[0];
      }
    }
    if (!captureDate) {
      captureDate = new Date(stats.birthtime).toISOString().split("T")[0];
    }

    // Try to get GPS coordinates if present
    const location = ""; // Default empty, user can input manually
    const gps =
      exifData?.latitude && exifData?.longitude
        ? { lat: exifData.latitude, lng: exifData.longitude }
        : null;

    return NextResponse.json({
      exif: {
        camera,
        lens,
        focalLength,
        aperture,
        shutterSpeed,
        iso,
        location,
      },
      createdAt: captureDate,
      gps,
      filename,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
