import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "https://www.sovet-nvrsk.ru");
const canonicalBase = "https://www.sovet-nvrsk.ru";

async function request(pathname, options = {}) {
  return fetch(new URL(pathname, base), { redirect: "manual", ...options });
}

function canonicalFrom(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || null;
}

const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "sitemap.xml status");
const sitemap = await sitemapResponse.text();
const canonicalUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(canonicalUrls.length, 29, "sitemap URL count");

for (const canonicalUrl of canonicalUrls) {
  const pathname = new URL(canonicalUrl).pathname;
  const response = await request(pathname);
  assert.equal(response.status, 200, pathname);
  const html = await response.text();
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${pathname} H1 count`);
  assert.equal(canonicalFrom(html), canonicalUrl, `${pathname} canonical`);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, pathname);
}

const privacy = await request("/privacy/");
assert.equal(privacy.status, 200, "/privacy/ status");
assert.match(
  await privacy.text(),
  /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i,
  "/privacy/ noindex",
);

const showcase = await request("/nexum/");
assert.equal(showcase.status, 200, "/nexum/ status");
const showcaseHtml = await showcase.text();
assert.match(showcaseHtml, /ИИ-сотрудники берут рутину на себя/i);
assert.match(showcaseHtml, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);

const missing = await request("/not-a-real-page-qa-20260809/");
assert.equal(missing.status, 404, "unknown page status");
const missingHtml = await missing.text();
assert.match(missingHtml, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
assert.equal(canonicalFrom(missingHtml), null, "unknown page must not have canonical");

const home = await request("/");
assert.equal(home.status, 200, "home status");
const homeHtml = await home.text();
assert.doesNotMatch(homeHtml, /sovet-novoross\.ru|forms\.sovet/i);
assert.match(homeHtml, /\+7 995 263 15 53/);
assert.match(homeHtml, /https:\/\/t\.me\/\+79952631553/);
assert.match(homeHtml, /https:\/\/wa\.me\/79952631553/);
assert.doesNotMatch(homeHtml, /<form\b|Отправить заявку/i);

const assets = [
  ...new Set(
    [...homeHtml.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map((match) => match[1]),
  ),
];
assert.ok(assets.length > 0, "no Next.js assets found");
for (const pathname of assets) {
  const response = await request(pathname, { method: "HEAD" });
  assert.equal(response.status, 200, pathname);
  assert.doesNotMatch(response.headers.get("content-type") || "", /text\/html/i, pathname);
}

const video = await request("/nexum/nexum-hero.mp4", { headers: { Range: "bytes=0-1023" } });
assert.equal(video.status, 206, "video range status");
assert.match(video.headers.get("content-type") || "", /^video\//i, "video content type");

const apexProbe = await fetch("https://sovet-nvrsk.ru/services/?utm_source=qa", { redirect: "manual" });
if ([301, 308].includes(apexProbe.status)) {
  assert.equal(
    apexProbe.headers.get("location"),
    `${canonicalBase}/services/?utm_source=qa`,
    "apex redirect location",
  );
} else {
  assert.equal(apexProbe.status, 200, "apex status");
  assert.equal(canonicalFrom(await apexProbe.text()), `${canonicalBase}/services/`);
}

console.log(`PASS ${base.origin}: ${canonicalUrls.length} SEO URLs, ${assets.length} assets, Nexum, contacts, 404 and apex canonical.`);
