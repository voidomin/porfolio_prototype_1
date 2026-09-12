/**
 * @jest-environment node
 */
jest.mock("fs");
jest.mock("exifr", () => ({
  __esModule: true,
  default: { parse: jest.fn() },
}));

import fs from "fs";
import path from "path";
import exifr from "exifr";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { createFsState } from "@/test-utils/adminApiTestHelpers";

const dirPath = path.join(process.cwd(), "images-to-process");
const exifrParse = exifr.parse as jest.Mock;

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.statSync as jest.Mock).mockImplementation(state.statSync);
  return state;
}

function req(file: string) {
  return new NextRequest(`http://localhost/api/admin/exif?file=${encodeURIComponent(file)}`);
}

describe("GET /api/admin/exif", () => {
  test("400 when file is missing", async () => {
    const res = await GET(new NextRequest("http://localhost/api/admin/exif"));
    expect(res.status).toBe(400);
  });

  test("403 on a traversal attempt (the fix)", async () => {
    wireFs(createFsState());
    const res = await GET(req("../../../etc/passwd"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Unauthorized access path" });
  });

  test("404 when the file isn't found", async () => {
    wireFs(createFsState());
    const res = await GET(req("missing.jpg"));
    expect(res.status).toBe(404);
  });

  test("maps EXIF fields, formatting a >=0.9s exposure as a rounded decimal", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({
      Model: "Canon EOS R5",
      LensModel: "RF 24-70mm",
      FocalLength: 50,
      FNumber: 2.8,
      ExposureTime: 1.25,
      ISOSpeedRatings: 400,
      DateTimeOriginal: "2024-03-15T12:00:00Z",
    });

    const body = await (await GET(req("shot.jpg"))).json();

    expect(body.exif).toEqual({
      camera: "Canon EOS R5",
      lens: "RF 24-70mm",
      focalLength: "50mm",
      aperture: "f/2.8",
      shutterSpeed: "1.3s",
      iso: "400",
      location: "",
    });
    expect(body.createdAt).toBe("2024-03-15");
  });

  test("formats a sub-second exposure as a fraction", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({ ExposureTime: 1 / 250 });

    const body = await (await GET(req("shot.jpg"))).json();
    expect(body.exif.shutterSpeed).toBe("1/250s");
  });

  test("falls back gracefully (blank fields, birthtime-based date) when exifr.parse rejects", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockRejectedValue(new Error("corrupt EXIF"));

    const res = await GET(req("shot.jpg"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.exif).toEqual({
      camera: "",
      lens: "",
      focalLength: "",
      aperture: "",
      shutterSpeed: "",
      iso: "",
      location: "",
    });
    expect(body.createdAt).toBe("2024-01-01");
  });

  test("reverse-geocodes when GPS data is present", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({ latitude: 35.0, longitude: 139.0 });
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ address: { city: "Tokyo", country: "Japan" } }),
    }) as unknown as typeof fetch;

    const body = await (await GET(req("shot.jpg"))).json();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(body.gps).toEqual({ lat: 35.0, lng: 139.0 });
    expect(body.exif.location).toBe("Tokyo, Japan");
  });

  test("location is '' when the reverse-geocode response isn't ok", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({ latitude: 35.0, longitude: 139.0 });
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const body = await (await GET(req("shot.jpg"))).json();
    expect(body.exif.location).toBe("");
  });

  test("location is '' when the reverse-geocode fetch throws/aborts", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({ latitude: 35.0, longitude: 139.0 });
    global.fetch = jest.fn().mockRejectedValue(new Error("aborted")) as unknown as typeof fetch;

    const body = await (await GET(req("shot.jpg"))).json();
    expect(body.exif.location).toBe("");
  });

  test("never calls fetch when there's no GPS data", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: "x" }));
    exifrParse.mockResolvedValue({ Model: "Canon" });
    global.fetch = jest.fn() as unknown as typeof fetch;

    const body = await (await GET(req("shot.jpg"))).json();

    expect(global.fetch).not.toHaveBeenCalled();
    expect(body.gps).toBeNull();
  });
});
