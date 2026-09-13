/**
 * @jest-environment node
 */
import { GET } from "./route";

const ORIGINAL_TOKEN = process.env.GITHUB_TOKEN;

afterEach(() => {
  if (ORIGINAL_TOKEN === undefined) {
    delete process.env.GITHUB_TOKEN;
  } else {
    process.env.GITHUB_TOKEN = ORIGINAL_TOKEN;
  }
});

describe("GET /api/github-activity", () => {
  test("returns an empty list with 200 (not an error) when GITHUB_TOKEN is unset", async () => {
    delete process.env.GITHUB_TOKEN;
    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ days: [] });
  });

  test("flattens weeks into a flat day list on a successful response", async () => {
    process.env.GITHUB_TOKEN = "fake-token";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: {
          user: {
            contributionsCollection: {
              contributionCalendar: {
                weeks: [
                  {
                    contributionDays: [
                      { date: "2024-01-01", contributionCount: 2 },
                      { date: "2024-01-02", contributionCount: 0 },
                    ],
                  },
                ],
              },
            },
          },
        },
      }),
    }) as unknown as typeof fetch;

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      days: [
        { date: "2024-01-01", count: 2 },
        { date: "2024-01-02", count: 0 },
      ],
    });
  });

  test("returns an empty list (not 500) when GitHub responds non-OK", async () => {
    process.env.GITHUB_TOKEN = "fake-token";
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ days: [] });
  });

  test("returns an empty list (not 500) when the request throws/times out", async () => {
    process.env.GITHUB_TOKEN = "fake-token";
    global.fetch = jest.fn().mockRejectedValue(new Error("aborted")) as unknown as typeof fetch;

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ days: [] });
  });

  test("returns an empty list when the response shape is unexpected", async () => {
    process.env.GITHUB_TOKEN = "fake-token";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { user: null } }),
    }) as unknown as typeof fetch;

    const res = await GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ days: [] });
  });
});
