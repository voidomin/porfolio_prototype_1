import { test, expect } from "@playwright/test";

/* ──────────────────────────────────────────────────────────
   Navigation — homepage load, navbar section-scrolling, and
   the Command Palette (⌘K quick-jump). Selectors are pulled
   directly from the real components (Navbar.tsx, CommandPalette.tsx,
   src/data/portfolio.ts's navigationItems) rather than guessed.
   ────────────────────────────────────────────────────────── */

const SECTIONS = [
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

test.describe("homepage navigation", () => {
  test("loads with the hero visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#home")).toBeInViewport();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  for (const { label, id } of SECTIONS) {
    test(`navbar link scrolls to #${id}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForTimeout(500); // let hydration/entrance animations settle
      // .first() — the Footer also renders its own <nav aria-label="Footer">
      // with matching link labels; the main Navbar is always first in DOM order.
      await page.locator("nav").first().getByRole("link", { name: label, exact: true }).click();
      // Generous timeout: Lenis's own smooth-scroll animation plus, for
      // sections with async content below the fold (e.g. About's GitHub
      // activity trail), a layout shift that can nudge the final scroll
      // position — both are real, legitimate settle time, not a workaround.
      await expect(page.locator(`#${id}`)).toBeInViewport({ timeout: 8000 });
    });
  }
});

test.describe("Command Palette", () => {
  test("opens on Cmd/Ctrl+K, filters results, and navigates on selection", async ({ page }) => {
    await page.goto("/");

    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Quick navigation" });
    await expect(dialog).toBeVisible();

    const input = dialog.getByPlaceholder("Jump to a section, project, or post...");
    await expect(input).toBeFocused();

    await input.fill("skills");
    await expect(dialog.getByRole("button", { name: "Skills", exact: true })).toBeVisible();
    await expect(dialog.getByRole("button", { name: "Projects", exact: true })).not.toBeVisible();

    await dialog.getByRole("button", { name: "Skills", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.locator("#skills")).toBeInViewport({ timeout: 5000 });
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog", { name: "Quick navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Quick navigation" })).not.toBeVisible();
  });
});
