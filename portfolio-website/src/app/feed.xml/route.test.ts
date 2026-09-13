/**
 * @jest-environment node
 */
import { GET } from "./route";
import { blogPosts } from "@/data/portfolio";

describe("GET /feed.xml", () => {
  test("returns well-formed RSS 2.0 XML with the correct content type", async () => {
    const res = await GET();
    expect(res.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");

    const xml = await res.text();
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).toContain("</rss>");
  });

  test("includes one <item> per real blog post with the correct link/guid/title", () => {
    return GET()
      .then((res) => res.text())
      .then((xml) => {
        expect(blogPosts.length).toBeGreaterThan(0);
        for (const post of blogPosts) {
          expect(xml).toContain(`<title>${post.title}</title>`);
          expect(xml).toContain(`https://goldenhourlabs.vercel.app/blog/${post.slug}`);
        }
        const itemCount = (xml.match(/<item>/g) || []).length;
        expect(itemCount).toBe(blogPosts.length);
      });
  });

  test("escapes XML-special characters in the title/description", async () => {
    const xml = await (await GET()).text();
    // The feed builder must never emit a raw '&' outside of a recognized entity.
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });
});
