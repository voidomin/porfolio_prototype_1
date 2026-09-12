/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { createFsState } from "@/test-utils/adminApiTestHelpers";

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
}

const dirPath = path.join(process.cwd(), "images-to-process");

describe("GET /api/admin/view", () => {
  test("400 when filename is missing", async () => {
    wireFs(createFsState());
    const res = await GET(new NextRequest("http://localhost/api/admin/view"));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Filename is required" });
  });

  test("403 on a traversal attempt", async () => {
    wireFs(createFsState());
    const res = await GET(
      new NextRequest(
        "http://localhost/api/admin/view?file=" + encodeURIComponent("../../../etc/passwd")
      )
    );
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Unauthorized access path" });
  });

  test("404 when the file exists in neither the pending dir nor imported/", async () => {
    wireFs(createFsState());
    const res = await GET(new NextRequest("http://localhost/api/admin/view?file=missing.jpg"));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "File not found" });
  });

  test("serves a pending file with the correct content type and exact bytes", async () => {
    const bytes = Buffer.from([1, 2, 3, 4]);
    const state = createFsState({ [path.join(dirPath, "photo.png")]: bytes });
    wireFs(state);

    const res = await GET(new NextRequest("http://localhost/api/admin/view?file=photo.png"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(Buffer.from(await res.arrayBuffer())).toEqual(bytes);
  });

  test("falls back to the archived (imported/) copy when not found in the main dir", async () => {
    const bytes = Buffer.from("archived-webp-bytes");
    const state = createFsState({
      [path.join(dirPath, "imported", "old.webp")]: bytes,
    });
    wireFs(state);

    const res = await GET(new NextRequest("http://localhost/api/admin/view?file=old.webp"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/webp");
    expect(Buffer.from(await res.arrayBuffer())).toEqual(bytes);
  });

  test("defaults to octet-stream for an unrecognized extension", async () => {
    const bytes = Buffer.from("raw");
    const state = createFsState({ [path.join(dirPath, "photo.tiff")]: bytes });
    wireFs(state);

    const res = await GET(new NextRequest("http://localhost/api/admin/view?file=photo.tiff"));

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/octet-stream");
  });
});
