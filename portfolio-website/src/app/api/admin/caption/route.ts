import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename || typeof filename !== "string") {
      return NextResponse.json({ error: "filename is required" }, { status: 400 });
    }

    const dirPath = path.join(process.cwd(), "images-to-process");
    const filePath = path.resolve(path.join(dirPath, filename));

    if (!filePath.startsWith(dirPath)) {
      return NextResponse.json({ error: "Unauthorized access path" }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = path.extname(filename).toLowerCase();
    const mimeTypeMap: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    const mimeType = mimeTypeMap[ext] ?? "image/jpeg";

    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `You are helping a photographer caption their portfolio photo. Study the image carefully and generate exactly 3 distinct caption options.

Each option must have:
- title: A short evocative exhibition title (2-5 words, poetic/atmospheric, title case)
- altText: A descriptive accessibility alt text sentence (describes what is literally in the image)
- description: A short one-sentence backstory or mood caption for the gallery (15-30 words, atmospheric)

Reply ONLY with valid JSON in this exact format, no other text:
{
  "suggestions": [
    { "title": "...", "altText": "...", "description": "..." },
    { "title": "...", "altText": "...", "description": "..." },
    { "title": "...", "altText": "...", "description": "..." }
  ]
}`;

    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      prompt,
    ]);

    const raw = result.response.text();

    let suggestions;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      suggestions = JSON.parse(jsonMatch ? jsonMatch[0] : raw).suggestions;
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error("Caption API error:", error);
    if (error?.message?.includes("API_KEY")) {
      return NextResponse.json({ error: "Invalid or missing GEMINI_API_KEY" }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || "Caption generation failed" }, { status: 500 });
  }
}
