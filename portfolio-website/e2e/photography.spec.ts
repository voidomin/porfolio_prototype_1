import { test, expect } from "@playwright/test";

/* ──────────────────────────────────────────────────────────
   Photography lightbox (homepage's embedded carousel, not the
   /photography sub-page) — genuine interaction coverage the
   existing Jest test (photography/page.test.tsx, per ROADMAP.md)
   doesn't provide: opening, arrow-key navigation, and closing.
   ────────────────────────────────────────────────────────── */

test.describe("photography lightbox", () => {
  test("opens on a thumbnail click, navigates with arrow keys, and closes on Escape", async ({
    page,
  }) => {
    await page.goto("/#photography");
    const section = page.locator("#photography");
    await section.scrollIntoViewIfNeeded();

    const firstThumbnail = section.locator("button.group").first();
    await firstThumbnail.click();

    const lightbox = page.getByRole("dialog", { name: /full view$/ });
    await expect(lightbox).toBeVisible();
    const firstTitle = await lightbox.getAttribute("aria-label");

    await page.keyboard.press("ArrowRight");
    await expect
      .poll(async () => lightbox.getAttribute("aria-label"), { timeout: 5000 })
      .not.toBe(firstTitle);

    await page.keyboard.press("Escape");
    await expect(lightbox).not.toBeVisible();
  });
});
