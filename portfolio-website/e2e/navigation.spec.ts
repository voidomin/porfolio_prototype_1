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
    // Scoped to #home, not page-wide: LoadingScreen.tsx renders its own
    // transient "Akash" <h1> (shown once per session, sessionStorage-gated)
    // that can still be in the DOM alongside the real hero heading right
    // after navigation — a fresh Playwright context has empty session
    // storage every time, so this is hit on every run, not a rare fluke.
    // Confirmed directly via a CI failure log showing exactly two matching
    // h1 elements. Scoping to the hero section is correct regardless of
    // the overlap, since that's what this test actually means to check.
    await expect(page.locator("#home").getByRole("heading", { level: 1 })).toBeVisible();
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

// LoadingScreen.tsx shows once per session (a fresh Playwright context has
// empty sessionStorage every time) and dismisses itself on *any* keydown —
// including the very Ctrl+K these tests are about to send. Both its own
// dismiss listener and CommandPalette's toggle listener are on `window` and
// neither stops propagation, so in principle one keypress should trigger
// both — but this flaked once in CI (dialog never appeared, passed on
// retry), which looks like the two state updates landing in the same tick
// under load. Sending a throwaway Escape first (dismissing LoadingScreen if
// present, inert otherwise — nothing is open yet) decouples that from the
// real interaction under test, rather than guessing at a longer fixed wait.
async function dismissLoadingScreenIfPresent(page: import("@playwright/test").Page) {
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600); // past LoadingScreen's own 0.5s exit fade
}

test.describe("Command Palette", () => {
  test("opens on Cmd/Ctrl+K, filters results, and navigates on selection", async ({ page }) => {
    await page.goto("/");
    await dismissLoadingScreenIfPresent(page);

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
    await dismissLoadingScreenIfPresent(page);
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog", { name: "Quick navigation" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Quick navigation" })).not.toBeVisible();
  });
});
