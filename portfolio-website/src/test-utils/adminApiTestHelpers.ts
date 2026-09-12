/**
 * Shared helpers for testing the admin API routes (`src/app/api/admin/*`).
 *
 * These routes are tested by importing their exported handlers directly and
 * calling them with hand-built `NextRequest`s under `/** @jest-environment node
 * *\/` — see any `route.test.ts` for the pattern. `fs` itself is fully mocked
 * (`jest.mock("fs")`) rather than pointed at a real temp directory, since the
 * whole suite runs on every commit via Husky + CI: a real `fs` write mistake
 * here would land in the actual repo's `src/data/*.json` or `public/images`.
 *
 * `createFsState` returns plain functions (not `jest.fn()`-wrapped) — wire
 * them into the auto-mocked `fs` module per test via `mockImplementation`,
 * e.g.:
 *
 *   jest.mock("fs");
 *   import fs from "fs";
 *   const state = createFsState({ "src/data/gallery.json": "[]" });
 *   (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
 *   (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
 *   // ...etc for whichever fs functions the route under test actually calls
 */

import { NextRequest } from "next/server";

function normalize(p: string): string {
  return String(p).split("\\").join("/");
}

function enoent(op: string, p: string): NodeJS.ErrnoException {
  const err = new Error(`ENOENT: no such file or directory, ${op} '${p}'`) as NodeJS.ErrnoException;
  err.code = "ENOENT";
  return err;
}

export interface FsState {
  /** Raw file map (normalized path -> contents), for direct test assertions. */
  files: Map<string, Buffer>;
  /** Directories explicitly known to exist (beyond ancestors of known files). */
  dirs: Set<string>;
  addDir: (p: string) => void;
  existsSync: (p: string) => boolean;
  readFileSync: (p: string, encoding?: BufferEncoding) => string | Buffer;
  writeFileSync: (p: string, data: string | Buffer) => void;
  mkdirSync: (p: string) => void;
  readdirSync: (p: string) => string[];
  statSync: (p: string) => { isDirectory: () => boolean; birthtime: Date };
  renameSync: (oldPath: string, newPath: string) => void;
  unlinkSync: (p: string) => void;
}

/** Builds an in-memory fs state seeded with the given files (path -> string/Buffer content). */
export function createFsState(initialFiles: Record<string, string | Buffer> = {}): FsState {
  const files = new Map<string, Buffer>();
  const dirs = new Set<string>();

  for (const [p, content] of Object.entries(initialFiles)) {
    files.set(normalize(p), Buffer.isBuffer(content) ? content : Buffer.from(content, "utf-8"));
  }

  const addDir = (p: string) => dirs.add(normalize(p));

  const existsSync = (p: string) => {
    const n = normalize(p);
    return files.has(n) || dirs.has(n);
  };

  const readFileSync = (p: string, encoding?: BufferEncoding) => {
    const n = normalize(p);
    const buf = files.get(n);
    if (!buf) throw enoent("open", p);
    return encoding ? buf.toString(encoding) : buf;
  };

  const writeFileSync = (p: string, data: string | Buffer) => {
    files.set(normalize(p), Buffer.isBuffer(data) ? data : Buffer.from(data));
  };

  const mkdirSync = (p: string) => addDir(p);

  const readdirSync = (p: string) => {
    const prefix = normalize(p).replace(/\/$/, "") + "/";
    const names = new Set<string>();
    for (const f of Array.from(files.keys())) {
      if (f.startsWith(prefix)) {
        const rest = f.slice(prefix.length);
        if (rest && !rest.includes("/")) names.add(rest);
      }
    }
    for (const d of Array.from(dirs)) {
      if (d.startsWith(prefix)) {
        const rest = d.slice(prefix.length);
        if (rest && !rest.includes("/")) names.add(rest);
      }
    }
    return Array.from(names);
  };

  const statSync = (p: string) => {
    const n = normalize(p);
    const isDir = dirs.has(n);
    return { isDirectory: () => isDir, birthtime: new Date("2024-01-01T00:00:00.000Z") };
  };

  const renameSync = (oldPath: string, newPath: string) => {
    const oldN = normalize(oldPath);
    const buf = files.get(oldN);
    if (!buf) throw enoent("rename", oldPath);
    files.delete(oldN);
    files.set(normalize(newPath), buf);
  };

  const unlinkSync = (p: string) => {
    const n = normalize(p);
    if (!files.has(n)) throw enoent("unlink", p);
    files.delete(n);
  };

  return {
    files,
    dirs,
    addDir,
    existsSync,
    readFileSync,
    writeFileSync,
    mkdirSync,
    readdirSync,
    statSync,
    renameSync,
    unlinkSync,
  };
}

/** Builds a NextRequest with a JSON body (or no body for a plain GET/DELETE). */
export function jsonRequest(url: string, method: string, body?: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/** Builds a NextRequest carrying a multipart FormData body (for the upload route). */
export function formDataRequest(
  url: string,
  entries: Array<{ name: string; file: File }>
): NextRequest {
  const form = new FormData();
  for (const { name, file } of entries) form.append(name, file);
  return new NextRequest(url, { method: "POST", body: form });
}

/** Builds a browser-like `File` from string/Buffer content, for upload/formData tests. */
export function makeFile(name: string, content: string | Buffer, type = "image/jpeg"): File {
  const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return new File([bytes], name, { type });
}
