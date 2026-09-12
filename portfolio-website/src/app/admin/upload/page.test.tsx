import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminUploadPage from "./page";

// Mock next/image to render a plain img tag.
jest.mock("next/image", () => {
  const MockImage = ({ priority, unoptimized, fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
  MockImage.displayName = "MockImage";
  return MockImage;
});

// Mock next/link to render a plain a tag.
jest.mock("next/link", () => {
  const MockLink = ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

// react-image-crop's real drag-to-crop interaction can't be driven through jsdom, so this
// stand-in exposes a plain button that fires the same onChange/onComplete callbacks a real
// crop drag would — enough to test what happens to app state once a crop exists, without
// needing to simulate actual pointer drag mechanics.
jest.mock("react-image-crop", () => {
  const ReactLib = require("react");
  function ReactCropMock({ children, onChange, onComplete }: any) {
    return ReactLib.createElement(
      ReactLib.Fragment,
      null,
      ReactLib.createElement(
        "button",
        {
          type: "button",
          onClick: () => {
            const c = { unit: "%", x: 10, y: 10, width: 50, height: 50 };
            onChange(c);
            onComplete(c);
          },
        },
        "simulate-draw-crop"
      ),
      children
    );
  }
  return { __esModule: true, default: ReactCropMock };
});

function jsonResponse(body: unknown, ok = true): Response {
  return { ok, json: async () => body } as unknown as Response;
}

type FetchHandler = (init?: RequestInit) => Response | Promise<Response>;

/**
 * The page fires 4 fetches unconditionally on mount (pending/published/projects/
 * experiences); every test needs those satisfied even when it doesn't care about them.
 * Pass `handlers` for any endpoint a specific test needs to control or assert on.
 */
function makeFetchMock(handlers: Record<string, FetchHandler> = {}): jest.Mock {
  const defaults: Record<string, FetchHandler> = {
    "GET /api/admin/pending": () => jsonResponse({ files: [] }),
    "GET /api/admin/published": () => jsonResponse({ success: true, photos: [] }),
    "GET /api/admin/projects": () => jsonResponse({ success: true, projects: [] }),
    "GET /api/admin/experience": () => jsonResponse({ success: true, experiences: [] }),
  };
  const merged = { ...defaults, ...handlers };

  return jest.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = (init?.method || "GET").toUpperCase();
    const key = `${method} ${url.split("?")[0]}`;
    const handler = merged[key];
    if (!handler) {
      throw new Error(`Unhandled fetch in test: ${key}`);
    }
    return Promise.resolve(handler(init));
  });
}

describe("AdminUploadPage", () => {
  test("renders all three tabs and switches between them", async () => {
    global.fetch = makeFetchMock() as unknown as typeof fetch;
    render(<AdminUploadPage />);

    expect(screen.getByRole("button", { name: /Exhibition Photos/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Portfolio Projects/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Work History/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Portfolio Projects/ }));
    expect(await screen.findByText("Projects Queue")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Work History/ }));
    expect(await screen.findByText("Experiences")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Exhibition Photos/ }));
    expect(await screen.findByText("No pending photos found")).toBeInTheDocument();
  });

  test("submitting after 'Re-edit Visuals' hits the create/process pipeline, not the metadata PUT", async () => {
    const publishedPhoto = {
      id: "gal-1",
      src: "/images/photography/gal-1.webp",
      title: "My Published Shot",
      alt: "alt text",
      category: "nature",
      featured: true,
      createdAt: "2024-01-01",
      sourceFile: "gal-1-original.jpg",
    };

    global.fetch = makeFetchMock({
      "GET /api/admin/published": () => jsonResponse({ success: true, photos: [publishedPhoto] }),
      "POST /api/admin/process": () => jsonResponse({ success: true, entry: publishedPhoto }),
      "POST /api/admin/commit": () =>
        jsonResponse({ success: true, commit: "abc123", summary: "1 file changed" }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);

    fireEvent.click(await screen.findByRole("button", { name: /Published/ }));
    fireEvent.click(await screen.findByText("My Published Shot"));
    fireEvent.click(await screen.findByRole("button", { name: /Re-edit Visuals/ }));
    fireEvent.click(await screen.findByRole("button", { name: "Process & Commit" }));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(
        calls.some(
          ([url, init]: [string, RequestInit]) =>
            String(url).includes("/api/admin/process") && init?.method === "POST"
        )
      ).toBe(true);
    });
  });

  test("submitting a metadata-only edit (no re-edit-visuals) PUTs to /api/admin/published", async () => {
    const publishedPhoto = {
      id: "gal-1",
      src: "/images/photography/gal-1.webp",
      title: "My Published Shot",
      alt: "alt text",
      category: "nature",
      featured: true,
      createdAt: "2024-01-01",
      sourceFile: "gal-1-original.jpg",
    };

    global.fetch = makeFetchMock({
      "GET /api/admin/published": () => jsonResponse({ success: true, photos: [publishedPhoto] }),
      "PUT /api/admin/published": () => jsonResponse({ success: true, photo: publishedPhoto }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);

    fireEvent.click(await screen.findByRole("button", { name: /Published/ }));
    fireEvent.click(await screen.findByText("My Published Shot"));
    fireEvent.click(await screen.findByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      const calls = (global.fetch as jest.Mock).mock.calls;
      expect(
        calls.some(
          ([url, init]: [string, RequestInit]) =>
            String(url).includes("/api/admin/published") && init?.method === "PUT"
        )
      ).toBe(true);
    });
  });

  test("rotating the image clears any drawn crop", async () => {
    global.fetch = makeFetchMock({
      "GET /api/admin/pending": () => jsonResponse({ files: ["shot.jpg"] }),
      "GET /api/admin/exif": () =>
        jsonResponse({ exif: {}, createdAt: "2024-01-01", gps: null, filename: "shot.jpg" }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);
    fireEvent.click(await screen.findByText("shot.jpg"));

    await screen.findByText("Full resolution — no crop applied");

    fireEvent.click(screen.getByRole("button", { name: "simulate-draw-crop" }));
    expect(await screen.findByText("✕ Clear crop")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "90°" }));

    expect(screen.queryByText("✕ Clear crop")).not.toBeInTheDocument();
    expect(await screen.findByText("Full resolution — no crop applied")).toBeInTheDocument();
  });

  test("upload status banner: mixed accepted/rejected shows a success summary listing both", async () => {
    global.fetch = makeFetchMock({
      "POST /api/admin/upload": () =>
        jsonResponse({
          success: true,
          accepted: ["a.jpg"],
          rejected: [{ name: "b.pdf", reason: 'Unsupported file type ".pdf"' }],
        }),
    }) as unknown as typeof fetch;

    const { container } = render(<AdminUploadPage />);
    const input = container.querySelector<HTMLInputElement>("#batch-upload-input")!;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.jpg", { type: "image/jpeg" })] },
    });

    expect(
      await screen.findByText('Uploaded 1 photo(s). Skipped: b.pdf (Unsupported file type ".pdf")')
    ).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  test("upload status banner: all rejected shows an error", async () => {
    global.fetch = makeFetchMock({
      "POST /api/admin/upload": () =>
        jsonResponse({
          success: true,
          accepted: [],
          rejected: [{ name: "b.pdf", reason: 'Unsupported file type ".pdf"' }],
        }),
    }) as unknown as typeof fetch;

    const { container } = render(<AdminUploadPage />);
    const input = container.querySelector<HTMLInputElement>("#batch-upload-input")!;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "b.pdf", { type: "application/pdf" })] },
    });

    expect(
      await screen.findByText('Upload failed: b.pdf (Unsupported file type ".pdf")')
    ).toBeInTheDocument();
    expect(screen.getByText("Error Occurred")).toBeInTheDocument();
  });

  test("upload status banner: all accepted, no rejections, shows a plain success message", async () => {
    global.fetch = makeFetchMock({
      "POST /api/admin/upload": () =>
        jsonResponse({ success: true, accepted: ["a.jpg"], rejected: [] }),
    }) as unknown as typeof fetch;

    const { container } = render(<AdminUploadPage />);
    const input = container.querySelector<HTMLInputElement>("#batch-upload-input")!;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.jpg", { type: "image/jpeg" })] },
    });

    expect(await screen.findByText("Uploaded 1 photo(s) to the queue.")).toBeInTheDocument();
  });

  test("upload status banner: a non-ok/failed response shows the server's error message", async () => {
    global.fetch = makeFetchMock({
      "POST /api/admin/upload": () =>
        jsonResponse(
          { success: false, accepted: [], rejected: [], error: "Server exploded" },
          true
        ),
    }) as unknown as typeof fetch;

    const { container } = render(<AdminUploadPage />);
    const input = container.querySelector<HTMLInputElement>("#batch-upload-input")!;
    fireEvent.change(input, {
      target: { files: [new File(["x"], "a.jpg", { type: "image/jpeg" })] },
    });

    expect(await screen.findByText("Server exploded")).toBeInTheDocument();
  });

  test("photo/project/experience delete-confirmation flags are independent", async () => {
    const project = {
      id: "1",
      slug: "my-project",
      title: "My Project",
      description: "d",
      image: "i",
      technologies: [],
      category: "web",
      featured: false,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    const experience = {
      id: "exp-1",
      period: "2020-2022",
      title: "My Experience",
      organization: "Acme",
      summary: "did stuff",
    };

    global.fetch = makeFetchMock({
      "GET /api/admin/projects": () => jsonResponse({ success: true, projects: [project] }),
      "GET /api/admin/experience": () => jsonResponse({ success: true, experiences: [experience] }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);

    fireEvent.click(await screen.findByRole("button", { name: /Portfolio Projects/ }));
    fireEvent.click(await screen.findByText("My Project"));
    fireEvent.click(await screen.findByText("Delete Project"));
    expect(await screen.findByText("Yes, Delete")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Work History/ }));
    fireEvent.click(await screen.findByText("My Experience"));

    expect(await screen.findByText("Delete Event")).toBeInTheDocument();
    expect(screen.queryByText("Yes, Delete")).not.toBeInTheDocument();
  });

  test("'Quick-Import All' is hidden at exactly one pending file", async () => {
    global.fetch = makeFetchMock({
      "GET /api/admin/pending": () => jsonResponse({ files: ["only.jpg"] }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);
    await screen.findByText("only.jpg");
    expect(screen.queryByText(/Quick-Import All/)).not.toBeInTheDocument();
  });

  test("'Quick-Import All' appears once there are two or more pending files", async () => {
    global.fetch = makeFetchMock({
      "GET /api/admin/pending": () => jsonResponse({ files: ["a.jpg", "b.jpg"] }),
    }) as unknown as typeof fetch;

    render(<AdminUploadPage />);
    expect(await screen.findByText("Quick-Import All (2)")).toBeInTheDocument();
  });
});
