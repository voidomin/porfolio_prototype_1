/**
 * @jest-environment node
 */
jest.mock("fs");
jest.mock("sharp", () => jest.fn());

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { POST } from "./route";
import { createFsState, jsonRequest } from "@/test-utils/adminApiTestHelpers";

const pendingDir = path.join(process.cwd(), "images-to-process");
const importedDir = path.join(pendingDir, "imported");
const dbPath = path.join(process.cwd(), "src", "data", "gallery.json");

interface SharpChain {
  rotate: jest.Mock;
  extract: jest.Mock;
  modulate: jest.Mock;
  linear: jest.Mock;
  resize: jest.Mock;
  composite: jest.Mock;
  webp: jest.Mock;
  toFile: jest.Mock;
}

let chain: SharpChain;

// `restoreMocks` (jest.config.js) resets every mock's implementation before each test,
// including ones set up inside a `jest.mock(...)` factory — so the sharp chain has to be
// rebuilt fresh per test rather than once at module scope.
beforeEach(() => {
  chain = {
    rotate: jest.fn().mockReturnThis(),
    extract: jest.fn().mockReturnThis(),
    modulate: jest.fn().mockReturnThis(),
    linear: jest.fn().mockReturnThis(),
    resize: jest.fn().mockReturnThis(),
    composite: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toFile: jest.fn().mockResolvedValue({ width: 800, height: 600 }),
  };
  (sharp as unknown as jest.Mock).mockImplementation(() => chain);
});

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
  (fs.writeFileSync as jest.Mock).mockImplementation(state.writeFileSync);
  (fs.mkdirSync as jest.Mock).mockImplementation(state.mkdirSync);
  (fs.renameSync as jest.Mock).mockImplementation(state.renameSync);
  return state;
}

function readGallery(state: ReturnType<typeof createFsState>) {
  return JSON.parse(state.readFileSync(dbPath, "utf-8") as string);
}

function baseBody(overrides: Record<string, unknown> = {}) {
  return {
    filename: "shot.jpg",
    id: "gal-new",
    title: "T",
    alt: "A",
    description: "D",
    category: "nature",
    featured: false,
    createdAt: "2024-01-01",
    exif: {},
    ...overrides,
  };
}

describe("POST /api/admin/process", () => {
  test("400 when filename, id or category is missing", async () => {
    wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/process", "POST", { title: "x" })
    );
    expect(res.status).toBe(400);
  });

  test("400 when id contains unsafe characters (the fix)", async () => {
    wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "x" }));
    const res = await POST(
      jsonRequest("http://localhost/api/admin/process", "POST", baseBody({ id: "../evil" }))
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid id" });
  });

  test("404 when the file exists in neither the pending dir nor imported/", async () => {
    wireFs(createFsState());
    const res = await POST(jsonRequest("http://localhost/api/admin/process", "POST", baseBody()));
    expect(res.status).toBe(404);
  });

  test("happy path: runs the sharp pipeline in order and upserts a new gallery entry", async () => {
    const state = wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "raw-bytes" }));

    const res = await POST(
      jsonRequest(
        "http://localhost/api/admin/process",
        "POST",
        baseBody({
          adjustments: { rotation: 90, brightness: 1.2, contrast: 1.5 },
          crop: { left: 1, top: 2, width: 100, height: 200 },
          watermark: { enabled: true, text: "Mine", position: "northwest" },
        })
      )
    );

    expect(res.status).toBe(200);

    const callOrder = [
      chain.rotate,
      chain.extract,
      chain.modulate,
      chain.linear,
      chain.resize,
      chain.composite,
      chain.webp,
      chain.toFile,
    ].map((fn) => fn.mock.invocationCallOrder[0]);
    expect(callOrder).toEqual([...callOrder].sort((a, b) => a - b));

    expect(chain.rotate).toHaveBeenCalledWith(90);
    expect(chain.extract).toHaveBeenCalledWith({ left: 1, top: 2, width: 100, height: 200 });
    expect(chain.modulate).toHaveBeenCalledWith({ brightness: 1.2 });
    expect(chain.linear).toHaveBeenCalled();
    expect(chain.composite).toHaveBeenCalledWith([
      expect.objectContaining({ gravity: "northwest" }),
    ]);

    expect(state.existsSync(path.join(pendingDir, "shot.jpg"))).toBe(false);
    expect(state.existsSync(path.join(importedDir, "shot.jpg"))).toBe(true);

    const gallery = readGallery(state);
    expect(gallery).toHaveLength(1);
    expect(gallery[0].id).toBe("gal-new");
    expect(gallery[0].src).toBe("/images/photography/gal-new.webp");
    expect(gallery[0].width).toBe(800);
  });

  test("skips crop when width/height aren't positive", async () => {
    wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "x" }));
    await POST(
      jsonRequest(
        "http://localhost/api/admin/process",
        "POST",
        baseBody({ crop: { left: 0, top: 0, width: 0, height: 0 } })
      )
    );
    expect(chain.extract).not.toHaveBeenCalled();
  });

  test("skips the contrast transform when contrast is 1.0 (the default)", async () => {
    wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "x" }));
    await POST(
      jsonRequest(
        "http://localhost/api/admin/process",
        "POST",
        baseBody({ adjustments: { contrast: 1.0 } })
      )
    );
    expect(chain.linear).not.toHaveBeenCalled();
  });

  test("skips the watermark composite when not enabled", async () => {
    wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "x" }));
    await POST(jsonRequest("http://localhost/api/admin/process", "POST", baseBody()));
    expect(chain.composite).not.toHaveBeenCalled();
  });

  test("re-editing an already-archived photo reads from imported/ and does not re-archive", async () => {
    const state = wireFs(createFsState({ [path.join(importedDir, "shot.jpg")]: "archived-bytes" }));

    const res = await POST(jsonRequest("http://localhost/api/admin/process", "POST", baseBody()));

    expect(res.status).toBe(200);
    expect(state.existsSync(path.join(importedDir, "shot.jpg"))).toBe(true);
  });

  test("upserts (replaces in place) when the id already exists in gallery.json", async () => {
    const existingEntry = { id: "gal-new", src: "/old.webp", title: "Old" };
    const state = wireFs(
      createFsState({
        [path.join(pendingDir, "shot.jpg")]: "x",
        [dbPath]: JSON.stringify([existingEntry, { id: "gal-other", title: "Other" }]),
      })
    );

    await POST(jsonRequest("http://localhost/api/admin/process", "POST", baseBody()));

    const gallery = readGallery(state);
    expect(gallery).toHaveLength(2);
    expect(gallery.find((g: { id: string }) => g.id === "gal-new").title).toBe("T");
    expect(gallery.find((g: { id: string }) => g.id === "gal-other")).toBeDefined();
  });

  test("omits the exif key entirely when every field is blank", async () => {
    const state = wireFs(createFsState({ [path.join(pendingDir, "shot.jpg")]: "x" }));
    await POST(jsonRequest("http://localhost/api/admin/process", "POST", baseBody({ exif: {} })));
    expect(readGallery(state)[0].exif).toBeUndefined();
  });
});
