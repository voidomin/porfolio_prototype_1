/**
 * @jest-environment node
 */
jest.mock("fs");

import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { GET, POST, PUT, DELETE } from "./route";
import { createFsState, jsonRequest } from "@/test-utils/adminApiTestHelpers";

const dbPath = path.join(process.cwd(), "src", "data", "experience.json");

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
  (fs.writeFileSync as jest.Mock).mockImplementation(state.writeFileSync);
  return state;
}

function readPersisted(state: ReturnType<typeof createFsState>) {
  return JSON.parse(state.readFileSync(dbPath, "utf-8") as string);
}

describe("GET /api/admin/experience", () => {
  test("returns an empty list when the db file doesn't exist", async () => {
    wireFs(createFsState());
    const res = await GET();
    expect(await res.json()).toEqual({ success: true, experiences: [] });
  });

  test("returns [] (not a 500) when the db file is corrupt JSON", async () => {
    wireFs(createFsState({ [dbPath]: "{ not valid json" }));
    const res = await GET();
    expect(await res.json()).toEqual({ success: true, experiences: [] });
  });

  test("returns existing experiences", async () => {
    const existing = [
      { id: "exp-1", period: "2020", title: "Eng", organization: "Acme", summary: "did stuff" },
    ];
    wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));
    const res = await GET();
    expect(await res.json()).toEqual({ success: true, experiences: existing });
  });
});

describe("POST /api/admin/experience", () => {
  test("400 when a required field is missing", async () => {
    wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/experience", "POST", {
        period: "2020",
        title: "Eng",
        organization: "Acme",
      })
    );
    expect(res.status).toBe(400);
  });

  test("happy path appends a new experience with a generated id and persists it", async () => {
    const state = wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/experience", "POST", {
        period: "2020-2022",
        title: "Engineer",
        organization: "Acme",
        summary: "Built things",
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.experience.id).toMatch(/^exp-\d+$/);

    const persisted = readPersisted(state);
    expect(persisted).toHaveLength(1);
    expect(persisted[0].title).toBe("Engineer");
  });
});

describe("PUT /api/admin/experience", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await PUT(jsonRequest("http://localhost/api/admin/experience", "PUT", {}));
    expect(res.status).toBe(400);
  });

  test("404 when the db file doesn't exist", async () => {
    wireFs(createFsState());
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/experience", "PUT", { id: "exp-1", title: "New" })
    );
    expect(res.status).toBe(404);
  });

  test("500 'Corrupted database' on unparseable JSON (unlike GET, which tolerates it)", async () => {
    wireFs(createFsState({ [dbPath]: "{ not valid" }));
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/experience", "PUT", { id: "exp-1", title: "New" })
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Corrupted database");
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await PUT(
      jsonRequest("http://localhost/api/admin/experience", "PUT", { id: "missing", title: "New" })
    );
    expect(res.status).toBe(404);
  });

  test("partial update falls back to existing values, and can't clear a field to an empty string", async () => {
    const existing = [
      { id: "exp-1", period: "2020", title: "Old Title", organization: "Acme", summary: "old" },
    ];
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await PUT(
      jsonRequest("http://localhost/api/admin/experience", "PUT", {
        id: "exp-1",
        title: "New Title",
        summary: "",
      })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.experience.title).toBe("New Title");
    expect(body.experience.summary).toBe("old");
    expect(readPersisted(state)[0].summary).toBe("old");
  });
});

describe("DELETE /api/admin/experience", () => {
  test("400 when id is missing", async () => {
    wireFs(createFsState());
    const res = await DELETE(new NextRequest("http://localhost/api/admin/experience"));
    expect(res.status).toBe(400);
  });

  test("404 when the id isn't found", async () => {
    wireFs(createFsState({ [dbPath]: "[]" }));
    const res = await DELETE(new NextRequest("http://localhost/api/admin/experience?id=missing"));
    expect(res.status).toBe(404);
  });

  test("removes the matching experience and persists the change", async () => {
    const existing = [
      { id: "exp-1", period: "2020", title: "A", organization: "Acme", summary: "a" },
      { id: "exp-2", period: "2021", title: "B", organization: "Acme", summary: "b" },
    ];
    const state = wireFs(createFsState({ [dbPath]: JSON.stringify(existing) }));

    const res = await DELETE(new NextRequest("http://localhost/api/admin/experience?id=exp-1"));

    expect(res.status).toBe(200);
    const persisted = readPersisted(state);
    expect(persisted).toHaveLength(1);
    expect(persisted[0].id).toBe("exp-2");
  });
});
