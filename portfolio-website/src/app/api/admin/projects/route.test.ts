/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { GET, POST, PUT, DELETE } from "./route";
import { createFsState, jsonRequest } from "@/test-utils/adminApiTestHelpers";

const dbPath = path.join(process.cwd(), "src", "data", "projects.json");

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
  (fs.writeFileSync as jest.Mock).mockImplementation(state.writeFileSync);
  return state;
}

function readPersisted(state: ReturnType<typeof createFsState>) {
  return JSON.parse(state.readFileSync(dbPath, "utf-8") as string);
}

describe("GET /api/admin/projects", () => {
  test("returns [] when the db file doesn't exist", async () => {
    wireFs(createFsState());
    expect(await (await GET()).json()).toEqual({ success: true, projects: [] });
  });

  test("returns [] (not a 500) when the db file is corrupt JSON", async () => {
    wireFs(createFsState({ [dbPath]: "not json" }));
    expect(await (await GET()).json()).toEqual({ success: true, projects: [] });
  });
});

describe("POST /api/admin/projects", () => {
  test("400 when a required field is missing", async () => {
    wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/projects", "POST", { title: "New Project" })
    );
    expect(res.status).toBe(400);
  });

  test("generates id 1 and an unambiguous slug on an empty database", async () => {
    const state = wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/projects", "POST", {
        title: "Vocab Mastery",
        description: "A vocabulary app",
        image: "/img.png",
        category: "web",
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.project.id).toBe("1");
    expect(body.project.slug).toBe("vocab-mastery");
    expect(readPersisted(state)).toHaveLength(1);
  });

  test("increments the id from the max existing numeric id", async () => {
    const existing = [
      {
        id: "5",
        slug: "existing",
        title: "Existing",
        description: "d",
        image: "i",
        category: "c",
        technologies: [],
        featured: false,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await POST(
      jsonRequest("http://localhost/api/admin/projects", "POST", {
        title: "New One",
        description: "d",
        image: "i",
        category: "c",
      })
    );

    const body = await res.json();
    expect(body.project.id).toBe("6");
    expect(readPersisted(state)).toHaveLength(2);
  });

  test("de-duplicates slugs by appending an incrementing suffix", async () => {
    const existing = [
      {
        id: "1",
        slug: "my-project",
        title: "My Project",
        description: "d",
        image: "i",
        category: "c",
        technologies: [],
        featured: false,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await POST(
      jsonRequest("http://localhost/api/admin/projects", "POST", {
        title: "My Project",
        description: "d2",
        image: "i2",
        category: "c",
      })
    );

    expect((await res.json()).project.slug).toBe("my-project-2");
  });
});

describe("PUT /api/admin/projects", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await PUT(jsonRequest("http://localhost/api/admin/projects", "PUT", {}));
    expect(res.status).toBe(400);
  });

  test("404 when the db file doesn't exist", async () => {
    wireFs(createFsState());
    const res = await PUT(jsonRequest("http://localhost/api/admin/projects", "PUT", { id: "1" }));
    expect(res.status).toBe(404);
  });

  test("500 'Corrupted database' on unparseable JSON", async () => {
    wireFs(createFsState({ [dbPath]: "{ nope" }));
    const res = await PUT(jsonRequest("http://localhost/api/admin/projects", "PUT", { id: "1" }));
    expect(res.status).toBe(500);
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await PUT(jsonRequest("http://localhost/api/admin/projects", "PUT", { id: "1" }));
    expect(res.status).toBe(404);
  });

  test("string fields can be explicitly cleared to an empty string (typeof-checked, not ||-checked)", async () => {
    const existing = [
      {
        id: "1",
        slug: "s",
        title: "T",
        description: "d",
        image: "i",
        category: "c",
        technologies: [],
        featured: false,
        demoUrl: "https://example.com",
        githubUrl: "https://github.com/x",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await PUT(
      jsonRequest("http://localhost/api/admin/projects", "PUT", { id: "1", demoUrl: "" })
    );

    expect(res.status).toBe(200);
    expect((await res.json()).project.demoUrl).toBe("");
    expect(readPersisted(state)[0].demoUrl).toBe("");
  });
});

describe("DELETE /api/admin/projects", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await DELETE(new NextRequest("http://localhost/api/admin/projects"));
    expect(res.status).toBe(400);
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await DELETE(new NextRequest("http://localhost/api/admin/projects?id=missing"));
    expect(res.status).toBe(404);
  });

  test("removes the matching project and persists the change", async () => {
    const existing = [
      {
        id: "1",
        slug: "a",
        title: "A",
        description: "d",
        image: "i",
        category: "c",
        technologies: [],
        featured: false,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await DELETE(new NextRequest("http://localhost/api/admin/projects?id=1"));

    expect(res.status).toBe(200);
    expect(readPersisted(state)).toHaveLength(0);
  });
});
