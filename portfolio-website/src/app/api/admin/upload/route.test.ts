/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { POST } from "./route";
import { createFsState, formDataRequest, makeFile } from "@/test-utils/adminApiTestHelpers";

const pendingDir = path.join(process.cwd(), "images-to-process");

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.mkdirSync as jest.Mock).mockImplementation(state.mkdirSync);
  (fs.writeFileSync as jest.Mock).mockImplementation(state.writeFileSync);
  return state;
}

describe("POST /api/admin/upload", () => {
  test("400 when no files are provided", async () => {
    wireFs(createFsState());
    const res = await POST(formDataRequest("http://localhost/api/admin/upload", []));
    expect(res.status).toBe(400);
  });

  test("creates the pending directory if it doesn't exist", async () => {
    wireFs(createFsState());
    await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("a.jpg", "hello") },
      ])
    );
    expect(fs.mkdirSync).toHaveBeenCalledWith(pendingDir, { recursive: true });
  });

  test("rejects an unsupported extension with a reason, but still returns 200", async () => {
    const state = wireFs(createFsState());
    state.addDir(pendingDir);
    const res = await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("doc.pdf", "hello", "application/pdf") },
      ])
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.accepted).toEqual([]);
    expect(body.rejected).toEqual([{ name: "doc.pdf", reason: 'Unsupported file type ".pdf"' }]);
  });

  test("rejects a file over the 50MB limit", async () => {
    wireFs(createFsState()).addDir(pendingDir);
    const oversized = Buffer.alloc(50 * 1024 * 1024 + 1);
    const res = await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("big.jpg", oversized) },
      ])
    );
    expect((await res.json()).rejected).toEqual([
      { name: "big.jpg", reason: "File exceeds 50MB limit" },
    ]);
  });

  test("sanitizes filenames: special characters collapse to single dashes, and an all-special name falls back to 'photo'", async () => {
    wireFs(createFsState()).addDir(pendingDir);
    const res = await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("my photo!! (final).jpg", "x") },
        { name: "files", file: makeFile("!!!.png", "x") },
      ])
    );
    const body = await res.json();
    expect(body.accepted[0]).toBe("my-photo-final.jpg");
    expect(body.accepted[1]).toBe("photo.png");
  });

  test("appends a timestamp suffix when the sanitized target name already exists", async () => {
    wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "existing" })).addDir(pendingDir);
    const res = await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("shot.jpg", "new content") },
      ])
    );
    expect((await res.json()).accepted[0]).toMatch(/^shot-\d+\.jpg$/);
  });

  test("an all-rejected batch still returns 200 with an empty accepted array", async () => {
    wireFs(createFsState()).addDir(pendingDir);
    const res = await POST(
      formDataRequest("http://localhost/api/admin/upload", [
        { name: "files", file: makeFile("doc.pdf", "x", "application/pdf") },
      ])
    );
    expect(res.status).toBe(200);
    expect((await res.json()).accepted).toEqual([]);
  });
});
