import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = process.env.TEST_URL || "http://localhost:3000";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  assert.equal(await page.locator(".package-card").count(), 4);
  assert.equal(await page.locator('a[href*="/admin"]').count(), 0);
  assert.equal(await page.locator('#portfolio, #before-after, .testimonials').count(), 0);
  assert.equal(await page.locator('.hero img').count(), 0);
  assert.doesNotMatch(await page.locator('body').innerText(), /MongoDB|configure your content|preview|placeholder|admin/i);
  assert.doesNotMatch(await (await page.request.get(`${base}/sitemap.xml`)).text(), /admin/i);
  await page.getByRole("button", { name: "View Details" }).first().click();
  assert.equal(await page.locator("dialog[open]").count(), 1);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({ path: "artifacts/desktop.png", fullPage: true });
  for (const width of [320, 375, 390, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(base, { waitUntil: "networkidle" });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Packages", exact: true })
    .click();
  assert.equal(
    await page
      .getByRole("button", { name: "Toggle menu" })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.screenshot({ path: "artifacts/mobile.png", fullPage: true });
  await page.goto(`${base}/admin`);
  await page.getByRole("heading", { name: "Your beauty studio." }).waitFor();
  assert.equal(
    await page.getByLabel("Password", { exact: true }).getAttribute("type"),
    "password",
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  for (const resource of [
    "manifest.webmanifest",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "apple-icon.png",
    "sw.js",
    "offline.html",
    "robots.txt",
    "sitemap.xml",
    "opengraph-image",
  ])
    assert.equal(
      (await page.request.get(`${base}/${resource}`)).status(),
      200,
      resource,
    );
  const unauthorized = await page.request.post(`${base}/api/admin/packages`, {
    headers: { Origin: base },
    data: { name: "Unauthorized" },
  });
  assert.equal(unauthorized.status(), 401);
  const crossOrigin = await page.request.post(`${base}/api/admin/packages`, {
    headers: { Origin: "https://untrusted.example" },
    data: {},
  });
  assert.equal(crossOrigin.status(), 403);
  const unauthorizedUpload = await page.request.post(
    `${base}/api/admin/upload`,
    { headers: { Origin: base } },
  );
  assert.equal(unauthorizedUpload.status(), 401);
  assert.deepEqual(errors, []);
  console.log(
    "Browser smoke checks passed: desktop/mobile layouts, package dialog, navigation, admin gate, API protection, SEO and PWA assets.",
  );
} finally {
  await browser.close();
}
