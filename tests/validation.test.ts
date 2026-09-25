import test from "node:test";
import assert from "node:assert/strict";
import { schemas, whatsappLink } from "../lib/validation";
import { initialPackages, defaultSettings } from "../lib/defaults";
test("Seed content meets mutation validation", () => {
  for (const item of initialPackages)
    assert.equal(schemas.packages.safeParse(item).success, true);
  assert.equal(schemas.settings.safeParse(defaultSettings).success, true);
});
test("Reject unsafe links, unsupported images and invalid prices", () => {
  assert.equal(
    schemas.settings.safeParse({
      ...defaultSettings,
      instagramUrl: "javascript:alert(1)",
    }).success,
    false,
  );
  assert.equal(
    schemas.packages.safeParse({ ...initialPackages[0], price: -1 }).success,
    false,
  );
  assert.equal(
    schemas.packages.safeParse({
      ...initialPackages[0],
      image: "https://evil.example/test.png",
    }).success,
    false,
  );
});
test("WhatsApp uses configured international number and encodes package message", () => {
  assert.equal(whatsappLink(""), null);
  const url = new URL(whatsappLink("+96112345678", "Bride & Glam")!);
  assert.equal(url.hostname, "wa.me");
  assert.equal(url.pathname, "/96112345678");
  assert.match(url.searchParams.get("text")!, /Bride & Glam package/);
});
test("Required before/after images and active boolean are validated", () => {
  assert.equal(
    schemas.beforeAfter.safeParse({
      title: "Look",
      description: "",
      order: 0,
      active: true,
      beforeImage: "",
      afterImage: "",
    }).success,
    false,
  );
  assert.equal(
    schemas.packages.safeParse({ ...initialPackages[0], active: "false" })
      .success,
    false,
  );
});
