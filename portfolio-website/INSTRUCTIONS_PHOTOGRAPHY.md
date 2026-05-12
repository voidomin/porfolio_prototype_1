# How to Add Your Own Photos & EXIF Metadata

This guide explains how to easily add, manage, and upload your own personal landscape and travel photos to the **Golden Hour** photography section.

---

## ─── 3-Step Upload Procedure ───

### Step 1: Save Your Photo
Save your high-resolution or compressed photo (`.jpg`, `.jpeg`, `.png`, or `.webp`) inside the project's static assets folder:
📁 `public/images/photography/`

*Example: Save your file as `kashmir-dawn.jpg`*

### Step 2: Open your Portfolio Data file
Open the data file where all your portfolio entries are stored:
📄 `src/data/portfolio.ts`

Scroll down to the `galleryImages` array (around line 229).

### Step 3: Copy, Paste & Edit the Template
Copy the empty template below, paste it inside the `galleryImages` array, and fill in the fields.

```typescript
  {
    id: "gal-unique-id", // Change this to a unique ID (e.g., "gal-kashmir")
    src: "/images/photography/your-photo-name.jpg", // The local path to your image
    alt: "A short, descriptive alt text of what is in the photo",
    title: "Your Photograph Title",
    description: "A beautiful, optional one-sentence backstory about when or why you took this shot.",
    category: "nature", // Keep as "nature" to show up under the nature filter
    width: 1920, // Optional: aspect ratio width
    height: 1280, // Optional: aspect ratio height
    featured: true, // True to showcase it, false to hide/place lower
    createdAt: "2026-05-12", // Date of capture
    exif: {
      camera: "Sony Alpha 7R V", // Your camera body (leave empty or omit if not wanted)
      lens: "FE 24-70mm F2.8 GM II", // Your lens model
      focalLength: "24mm", // Focal length (e.g., "35mm")
      aperture: "f/8.0", // Aperture (e.g., "f/2.8", "f/8.0")
      shutterSpeed: "1/125s", // Shutter speed (e.g., "1/250s", "2s")
      iso: "100", // ISO (e.g., "100", "400")
      location: "Kashmir, India", // Where you took it
    },
  },
```

---

## 💡 Pro-Tips to Make It Even Easier

### 1. File Compression (Highly Recommended)
High-resolution photos straight from DSLR/Mirrorless cameras can be 10MB–40MB each, which will make the website load very slowly.
* Before uploading, compress your images using free tools like [TinyJPG / TinyPNG](https://tinypng.com/) or export them from Lightroom/Photoshop as **WebP** or **JPEG** at `70% - 80% quality` and a maximum width of `1600px` to `2000px`. This keeps them looking razor-sharp while being less than `500KB`!

### 2. Finding Your EXIF Data
If you don't remember the exact settings:
* **On Windows:** Right-click your original image file → select **Properties** → go to the **Details** tab. Scroll down to the "Camera" section to see your Camera model, Lens, Aperture, Shutter Speed, and ISO!
* **On Mac:** Double-click to open the image in Preview → press `Cmd + I` (Show Inspector) → click the **"i"** tab → click **EXIF**.

### 3. Hiding or Omitting Metadata
If you took a photo on your phone or don't have/want to show EXIF metadata, simply delete or omit the `exif` block entirely, or leave fields empty! The system is built to safely ignore missing EXIF fields and will hide those specific labels dynamically in the Lightbox drawer:

```typescript
  {
    id: "gal-mobile-shot",
    src: "/images/photography/my-mobile-photo.jpg",
    alt: "Sunset over Bangalore",
    title: "City Dusk",
    category: "nature",
    width: 1920,
    height: 1280,
    featured: true,
    createdAt: "2026-05-12",
    // No EXIF section needed!
  },
```
