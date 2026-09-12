/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("admin middleware", () => {
  const originalEnableAdmin = process.env.ENABLE_ADMIN;

  afterEach(() => {
    if (originalEnableAdmin === undefined) {
      delete process.env.ENABLE_ADMIN;
    } else {
      process.env.ENABLE_ADMIN = originalEnableAdmin;
    }
  });

  test.each(["/admin/upload", "/api/admin/pending"])(
    "returns 404 for %s when ENABLE_ADMIN is unset",
    (pathname) => {
      delete process.env.ENABLE_ADMIN;
      const res = middleware(new NextRequest(`http://localhost${pathname}`));
      expect(res.status).toBe(404);
    }
  );

  test("returns 404 when ENABLE_ADMIN is an empty string", () => {
    process.env.ENABLE_ADMIN = "";
    const res = middleware(new NextRequest("http://localhost/api/admin/pending"));
    expect(res.status).toBe(404);
  });

  test.each(["true", "1", "false", "0", "anything"])(
    "passes admin paths through when ENABLE_ADMIN=%s (any non-empty string is truthy in JS)",
    (value) => {
      process.env.ENABLE_ADMIN = value;
      const res = middleware(new NextRequest("http://localhost/api/admin/pending"));
      expect(res.status).not.toBe(404);
    }
  );

  test("never blocks non-admin paths regardless of ENABLE_ADMIN", () => {
    delete process.env.ENABLE_ADMIN;
    const res = middleware(new NextRequest("http://localhost/about"));
    expect(res.status).not.toBe(404);
  });
});
