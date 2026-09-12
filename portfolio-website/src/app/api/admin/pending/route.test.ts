/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { GET } from "./route";
import { createFsState } from "@/test-utils/adminApiTestHelpers";

const dirPath = path.join(process.cwd(), "images-to-process");
const importedDir = path.join(dirPath, "imported");

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
  (fs.mkdirSync as jest.Mock).mockImplementation(state.mkdirSync);
  (fs.readdirSync as jest.Mock).mockImplementation(state.readdirSync);
  (fs.statSync as jest.Mock).mockImplementation(state.statSync);
  return state;
}

describe("GET /api/admin/pending", () => {
  test("auto-creates images-to-process/ and its imported/ subfolder when neither exists", async () => {
    wireFs(createFsState());

    await GET();

    expect(fs.mkdirSync).toHaveBeenCalledWith(dirPath, { recursive: true });
    expect(fs.mkdirSync).toHaveBeenCalledWith(importedDir, { recursive: true });
  });

  test("lists only image files, case-insensitively, excluding the imported/ entry", async () => {
    const state = wireFs(
      createFsState({
        [path.join(dirPath, "a.jpg")]: "x",
        [path.join(dirPath, "b.PNG")]: "x",
        [path.join(dirPath, "c.txt")]: "x",
      })
    );
    state.addDir(dirPath);
    state.addDir(importedDir);

    const res = await GET();

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.files.sort()).toEqual(["a.jpg", "b.PNG"].sort());
    expect(body.files).not.toContain("imported");
  });
});
