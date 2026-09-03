# How to Add Photos to the Golden Hour Gallery

Photos are managed through the local admin CMS at `/admin/upload` — you never need to hand-edit `gallery.json` or `portfolio.ts` directly (both are now written by the CMS, and any manual edits will just get overwritten).

## Setup (one-time)

1. Add `ENABLE_ADMIN=true` to your `.env.local` in `portfolio-website/` (never set this in production — the middleware 404s `/admin` and `/api/admin/*` unless it's present).
2. Run `npm run dev` and open `http://localhost:3000/admin/upload`.

## Publishing a photo

1. **Queue tab** — drag your raw photo(s) onto the drop-zone (or click it to browse). Multiple files at once are fine; they land in the Queue automatically.
2. Click a queued photo. Camera EXIF (model, lens, aperture, shutter speed, ISO) and — if the photo has GPS data — a location string are auto-filled. Adjust title/description/category/crop/color as needed, or click "AI Suggest" for title/alt/description ideas.
3. Click **Process & Commit**. This crops/adjusts/encodes the photo to WebP, updates `src/data/gallery.json`, and creates a local git commit — it does **not** push.
4. For a large batch where you don't want to review each photo individually, use **Quick-Import All** in the Queue tab instead of step 2-3: it publishes every queued photo with auto-derived title/EXIF and no crop, then commits them together. Go refine titles/categories afterward from the **Published** tab.
5. When you're happy with the commit(s), run `git push` yourself and wait for the Vercel deploy — the CMS never pushes automatically.

## Fixing a photo after it's published

Open the **Published** tab, select the photo, and:
- To fix title/description/category/EXIF/location: edit the fields and click **Save Changes**.
- To fix crop/rotation/brightness/contrast/saturation/watermark: click **Re-edit Visuals**, adjust, and click **Process & Commit** again — no need to delete and re-import.

## Notes

- File size limit for the drop-zone is 50MB per photo; supported types are JPG/PNG/WebP.
- Location auto-fill uses free reverse geocoding (OpenStreetMap Nominatim) and only works if the source photo has embedded GPS coordinates — phone photos usually do, most cameras don't unless paired with a GPS unit/app.
- The AI caption suggestions require `GEMINI_API_KEY` to be set locally.
