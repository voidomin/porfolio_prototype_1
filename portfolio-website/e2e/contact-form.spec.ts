import { test, expect } from "@playwright/test";

/* ──────────────────────────────────────────────────────────
   Contact form — client-side validation (matching route.ts's
   own required-fields + email-regex contract) plus both submit
   outcomes via page.route() network mocking. Deliberately never
   hits the real /api/contact handler: no RESEND_API_KEY needed,
   no real email sent. A genuine live-send test is a separate,
   human-verified item (see ROADMAP.md) — this covers the UI's
   handling of both outcomes, which nothing did before.
   ────────────────────────────────────────────────────────── */

test.describe("contact form validation", () => {
  // Name/email/message all carry the HTML `required` attribute (email is
  // also `type="email"`) — clicking submit triggers the browser's own
  // native constraint validation *before* the form's `submit` event ever
  // fires, so React's handleSubmit (and its own "Please fill in all
  // required fields."/"Please enter a valid email address." messages)
  // never runs for these two cases in real browser use. Confirmed by
  // reproducing directly: the custom messages never appeared no matter how
  // long the test waited. These tests verify the behavior a real user
  // actually sees — the browser's native validation UI — rather than an
  // unreachable code path.
  test("empty required fields are blocked by native validation, not submitted", async ({
    page,
  }) => {
    let requestMade = false;
    await page.route("**/api/contact", (route) => {
      requestMade = true;
      route.continue();
    });

    await page.goto("/#contact");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.locator("#contact-name")).toHaveJSProperty("validity.valid", false);
    expect(requestMade).toBe(false);
  });

  test("a malformed email is blocked by native validation, not submitted", async ({ page }) => {
    let requestMade = false;
    await page.route("**/api/contact", (route) => {
      requestMade = true;
      route.continue();
    });

    await page.goto("/#contact");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("not-an-email");
    await page.locator("#contact-message").fill("Hello there.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.locator("#contact-email")).toHaveJSProperty("validity.valid", false);
    expect(requestMade).toBe(false);
  });
});

test.describe("contact form submit outcomes (network-mocked)", () => {
  test("shows a success banner and clears the form on a 200 response", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 200, json: { success: true } })
    );

    await page.goto("/#contact");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    // Lets the section's own entrance/reveal animation (framer-motion
    // whileInView) settle before interacting — without this, the very
    // first click right after scrolling in flaked intermittently.
    await page.waitForTimeout(500);

    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-message").fill("Hello there.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.locator("#contact").getByRole("alert")).toHaveText(
      "Thanks for reaching out. I will get back to you soon."
    );
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-message")).toHaveValue("");
  });

  test("shows the server's error message on a failed response", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({ status: 500, json: { error: "Failed to send message. Please try again later." } })
    );

    await page.goto("/#contact");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    // Lets the section's own entrance/reveal animation (framer-motion
    // whileInView) settle before interacting — without this, the very
    // first click right after scrolling in flaked intermittently.
    await page.waitForTimeout(500);

    await page.locator("#contact-name").fill("Test User");
    await page.locator("#contact-email").fill("test@example.com");
    await page.locator("#contact-message").fill("Hello there.");
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.locator("#contact").getByRole("alert")).toHaveText(
      "Failed to send message. Please try again later."
    );
    // Unlike the success path, a failed submit should NOT clear what was typed.
    await expect(page.locator("#contact-name")).toHaveValue("Test User");
  });
});
