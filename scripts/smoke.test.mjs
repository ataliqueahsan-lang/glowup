import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = (process.env.GLOWUP_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const routes = [
  "/",
  "/privacy",
  "/terms",
  "/contact",
  "/tools",
  "/tools/message-helper",
  "/tools/conversation-coach",
  "/tools/practice-mode",
  "/sitemap.xml",
  "/robots.txt",
];

for (const route of routes) {
  test(`${route} responds successfully`, async () => {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    assert.equal(response.status, 200);
  });
}

test("sitemap advertises legal and contact pages", async () => {
  const response = await fetch(`${baseUrl}/sitemap.xml`);
  const xml = await response.text();
  for (const route of ["/privacy", "/terms", "/contact"]) {
    assert.ok(xml.includes(`glowup-sable.vercel.app${route}`), `${route} missing from sitemap`);
  }
});

test("robots points to sitemap and disallows API routes", async () => {
  const response = await fetch(`${baseUrl}/robots.txt`);
  const robots = await response.text();
  assert.match(robots, /Disallow:\s*\/api\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/glowup-sable\.vercel\.app\/sitemap\.xml/i);
});
