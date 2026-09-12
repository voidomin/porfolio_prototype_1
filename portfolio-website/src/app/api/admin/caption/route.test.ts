/**
 * @jest-environment node
 */
jest.mock("fs");
jest.mock("@google/generative-ai");

import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { POST } from "./route";
import { createFsState, jsonRequest } from "@/test-utils/adminApiTestHelpers";

const dirPath = path.join(process.cwd(), "images-to-process");

function wireFs(state: ReturnType<typeof createFsState>) {
  (fs.existsSync as jest.Mock).mockImplementation(state.existsSync);
  (fs.readFileSync as jest.Mock).mockImplementation(state.readFileSync);
}

function mockGenerateContent(responseText: string) {
  const generateContent = jest.fn().mockResolvedValue({ response: { text: () => responseText } });
  (GoogleGenerativeAI as unknown as jest.Mock).mockImplementation(() => ({
    getGenerativeModel: () => ({ generateContent }),
  }));
  return generateContent;
}

describe("POST /api/admin/caption", () => {
  test("400 when filename is missing", async () => {
    const res = await POST(jsonRequest("http://localhost/api/admin/caption", "POST", {}));
    expect(res.status).toBe(400);
  });

  test("403 on a traversal attempt", async () => {
    wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", {
        filename: "../../../etc/passwd",
      })
    );
    expect(res.status).toBe(403);
  });

  test("404 when the file isn't found", async () => {
    wireFs(createFsState());
    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "missing.jpg" })
    );
    expect(res.status).toBe(404);
  });

  test("happy path returns AI-suggested captions, with correct mime type per extension", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.png")]: Buffer.from("fake-png-bytes") }));
    const generateContent = mockGenerateContent(
      JSON.stringify({ suggestions: [{ title: "A", altText: "b", description: "c" }] })
    );

    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "shot.png" })
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.suggestions).toHaveLength(1);
    expect(body.suggestions[0].title).toBe("A");

    const [[content]] = generateContent.mock.calls;
    expect(content[0].inlineData.mimeType).toBe("image/png");
  });

  test("extracts JSON even when the model wraps it in extra prose", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: Buffer.from("x") }));
    mockGenerateContent(
      `Sure! Here you go:\n${JSON.stringify({
        suggestions: [{ title: "T", altText: "A", description: "D" }],
      })}\nHope that helps.`
    );

    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "shot.jpg" })
    );

    expect(res.status).toBe(200);
    expect((await res.json()).suggestions[0].title).toBe("T");
  });

  test("500 'Failed to parse AI response' when the model reply isn't JSON", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: Buffer.from("x") }));
    mockGenerateContent("not json at all");

    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "shot.jpg" })
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Failed to parse AI response" });
  });

  test("200 with no suggestions when the parsed JSON has no 'suggestions' key (documents an existing gap)", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: Buffer.from("x") }));
    mockGenerateContent(JSON.stringify({ notSuggestions: [] }));

    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "shot.jpg" })
    );

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({});
  });

  test("500 with a specific message when the SDK reports a missing/invalid API key", async () => {
    wireFs(createFsState({ [path.join(dirPath, "shot.jpg")]: Buffer.from("x") }));
    (GoogleGenerativeAI as unknown as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error("API_KEY invalid")),
      }),
    }));

    const res = await POST(
      jsonRequest("http://localhost/api/admin/caption", "POST", { filename: "shot.jpg" })
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Invalid or missing GEMINI_API_KEY" });
  });
});
