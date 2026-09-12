/**
 * @jest-environment node
 */

// `commit/route.ts` calls `promisify(execFile)` at module-import time, and Node's real
// `execFile` carries its own `[util.promisify.custom]` implementation (since its callback
// yields two success values — stdout and stderr — not the single value plain `promisify`
// expects). Attaching our own controllable function to that same well-known symbol is what
// makes `promisify(execFile)` inside the route resolve/reject exactly the way we want here,
// deterministically, regardless of whether an automock would otherwise preserve it.
jest.mock("child_process", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { promisify } = require("util");
  const execFile = jest.fn();
  (execFile as unknown as Record<symbol, unknown>)[promisify.custom] = jest.fn();
  return { execFile };
});

import { execFile } from "child_process";
import { promisify } from "util";
import { POST } from "./route";
import { jsonRequest } from "@/test-utils/adminApiTestHelpers";

const execFileCustom = (execFile as unknown as Record<symbol, jest.Mock>)[promisify.custom];

function gitError(stdout: string, stderr: string) {
  return Object.assign(new Error("git command failed"), { stdout, stderr });
}

describe("POST /api/admin/commit", () => {
  test("400 when files or message are missing", async () => {
    const res = await POST(
      jsonRequest("http://localhost/api/admin/commit", "POST", { files: [], message: "x" })
    );
    expect(res.status).toBe(400);
  });

  test("400 when a path isn't under the allowlisted prefixes", async () => {
    const res = await POST(
      jsonRequest("http://localhost/api/admin/commit", "POST", {
        files: ["src/data/gallery.json", "src/middleware.ts"],
        message: "commit",
      })
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toMatch(/Refusing to commit unexpected paths/);
  });

  test("happy path: adds, commits, and returns the short hash", async () => {
    execFileCustom.mockResolvedValueOnce({ stdout: "", stderr: "" }); // git add
    execFileCustom.mockResolvedValueOnce({ stdout: "1 file changed", stderr: "" }); // git commit
    execFileCustom.mockResolvedValueOnce({ stdout: "abc1234\n", stderr: "" }); // git rev-parse

    const res = await POST(
      jsonRequest("http://localhost/api/admin/commit", "POST", {
        files: ["src/data/gallery.json"],
        message: "Add new photo",
      })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      success: true,
      commit: "abc1234",
      summary: "1 file changed",
    });
    expect(execFileCustom).toHaveBeenCalledTimes(3);
  });

  test("'nothing to commit' is treated as a non-fatal success", async () => {
    execFileCustom.mockResolvedValueOnce({ stdout: "", stderr: "" }); // git add
    execFileCustom.mockRejectedValueOnce(gitError("", "nothing to commit, working tree clean"));

    const res = await POST(
      jsonRequest("http://localhost/api/admin/commit", "POST", {
        files: ["src/data/gallery.json"],
        message: "no-op",
      })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, commit: null, summary: "Nothing to commit" });
  });

  test("any other git failure surfaces as a 500 with the combined output", async () => {
    execFileCustom.mockResolvedValueOnce({ stdout: "", stderr: "" }); // git add
    execFileCustom.mockRejectedValueOnce(
      gitError("", "fatal: unable to auto-detect email address")
    );

    const res = await POST(
      jsonRequest("http://localhost/api/admin/commit", "POST", {
        files: ["src/data/gallery.json"],
        message: "commit",
      })
    );

    expect(res.status).toBe(500);
    expect((await res.json()).error).toMatch(/unable to auto-detect email address/);
  });
});
