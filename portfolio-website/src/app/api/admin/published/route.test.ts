/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { GET, PUT, DELETE } from "./route";
import { createFsState, jsonRequest } from "@/test-utils/adminApiTestHelpers";

const dbPath = path.join(process.cwd(), "src", "data", "gallery.json");
const webpPath = (id: string) =>
  path.join(process.cwd(), "public", "images", "photography", `${id}.webp`);

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
  (fs.writeFileSync as jest.Mock).mockImplementation(state.writeFileSync);
  (fs.unlinkSync as jest.Mock).mockImplementation(state.unlinkSync);
  return state;
}

function readPersisted(state: ReturnType<typeof createFsState>) {
  return JSON.parse(state.readFileSync(dbPath, "utf-8") as string);
}

const basePhoto = {
  id: "gal-1",
  src: "/images/photography/gal-1.webp",
  alt: "alt",
  title: "Title",
  description: "desc",
  category: "nature",
  width: 100,
  height: 100,
  featured: false,
  createdAt: "2024-01-01",
};

describe("GET /api/admin/published", () => {
  test("returns [] when the db file doesn't exist", async () => {
    wireFs(createFsState());
    expect(await (await GET()).json()).toEqual({ success: true, photos: [] });
  });

  test("returns [] (not a 500) on corrupt JSON", async () => {
    wireFs(createFsState({ [dbPath]: "nope" }));
    expect(await (await GET()).json()).toEqual({ success: true, photos: [] });
  });

  test("returns existing photos", async () => {
    wireFs(createFsState({ [dbPath]: JSON.stringify([basePhoto]) }));
    expect(await (await GET()).json()).toEqual({ success: true, photos: [basePhoto] });
  });
});

describe("PUT /api/admin/published", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await PUT(jsonRequest("http://localhost/api/admin/published", "PUT", {}));
    expect(res.status).toBe(400);
  });

  test("404 when the db file doesn't exist", async () => {
    wireFs(createFsState());
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", { id: "gal-1" })
    );
    expect(res.status).toBe(404);
  });

  test("500 'Corrupted gallery database' on unparseable JSON", async () => {
    wireFs(createFsState({ [dbPath]: "{ nope" }));
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", { id: "gal-1" })
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Corrupted gallery database");
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", { id: "missing" })
    );
    expect(res.status).toBe(404);
  });

  test("description (??) can be explicitly cleared to '', but title (||) cannot", async () => {
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify([basePhoto]) }));

    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", {
        id: "gal-1",
        title: "",
        description: "",
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.photo.title).toBe(basePhoto.title); // falsy "" fell back to existing
    expect(body.photo.description).toBe(""); // ?? allows explicit clearing
    expect(readPersisted(state)[0].description).toBe("");
  });

  test("PUT's exif sub-object fully replaces (not merges with) the existing one", async () => {
    const withExif = {
      ...basePhoto,
      exif: {
        camera: "Old Camera",
        lens: "Old Lens",
        focalLength: "",
        aperture: "",
        shutterSpeed: "",
        iso: "",
        location: "",
      },
    };
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify([withExif]) }));

    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", {
        id: "gal-1",
        exif: { camera: "New Camera" },
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.photo.exif).toEqual({
      camera: "New Camera",
      lens: "",
      focalLength: "",
      aperture: "",
      shutterSpeed: "",
      iso: "",
      location: "",
    });
    expect(readPersisted(state)[0].exif.lens).toBe("");
  });

  test("exif key is removed entirely from the persisted entry when every field is blank", async () => {
    const withExif = { ...basePhoto, exif: { camera: "Old" } };
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify([withExif]) }));

    const res = await PUT(
      jsonRequest("http://localhost/api/admin/published", "PUT", { id: "gal-1", exif: {} })
    );

    expect(res.status).toBe(200);
    expect((await res.json()).photo.exif).toBeUndefined();
    expect(readPersisted(state)[0].exif).toBeUndefined();
  });
});

describe("DELETE /api/admin/published", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await DELETE(new NextRequest("http://localhost/api/admin/published"));
    expect(res.status).toBe(400);
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await DELETE(new NextRequest("http://localhost/api/admin/published?id=missing"));
    expect(res.status).toBe(404);
  });

  test("removes the JSON entry and deletes the physical .webp file", async () => {
    const state = wireFs(
      createFsState({
        [dbPath]: JSON.stringify([basePhoto]),
        [webpPath("gal-1")]: Buffer.from("fake-webp"),
      })
    );

    const res = await DELETE(new NextRequest("http://localhost/api/admin/published?id=gal-1"));

    expect(res.status).toBe(200);
    expect(readPersisted(state)).toHaveLength(0);
    expect(state.existsSync(webpPath("gal-1"))).toBe(false);
  });

  test("still removes the JSON entry and returns 200 even if deleting the physical file throws", async () => {
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify([basePhoto]) }));
    // No .webp file was seeded, but existsSync is stubbed to say it's there, so the
    // route attempts unlinkSync — which throws because the file doesn't really exist.
    (fs.existsSync as jest.Mock).mockImplementation((p: string) =>
      p === webpPath("gal-1") ? true : state.existsSync(p)
    );

    const res = await DELETE(new NextRequest("http://localhost/api/admin/published?id=gal-1"));

    expect(res.status).toBe(200);
    expect(readPersisted(state)).toHaveLength(0);
  });
});
