import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "https://preview.sovet-nvrsk.ru");
const canonicalBase = "https://www.sovet-nvrsk.ru";

async function request(pathname, options = {}) {
  const response = await fetch(new URL(pathname, base), {
    redirect: "manual",
    ...options,
  });
  return response;
}

function canonicalFrom(html) {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1] || null;
}

const sitemapResponse = await request("/sitemap.xml");
assert.equal(sitemapResponse.status, 200, "sitemap.xml status");
const sitemap = await sitemapResponse.text();
const canonicalUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert.equal(canonicalUrls.length, 28, "sitemap URL count");

for (const canonicalUrl of canonicalUrls) {
  const pathname = new URL(canonicalUrl).pathname;
  const response = await request(pathname);
  assert.equal(response.status, 200, pathname);
  const html = await response.text();
  assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${pathname} H1 count`);
  assert.equal(canonicalFrom(html), canonicalUrl, `${pathname} canonical`);
  assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, pathname);
}

for (const pathname of ["/privacy", "/consent", "/spasibo"]) {
  const response = await request(pathname);
  assert.equal(response.status, 200, pathname);
  assert.match(
    await response.text(),
    /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i,
    `${pathname} noindex`,
  );
}

const missing = await request("/not-a-real-page-qa-20260808");
assert.equal(missing.status, 404, "unknown page status");
assert.equal(missing.headers.get("x-robots-tag"), "noindex, nofollow", "unknown page robots");
const missingHtml = await missing.text();
assert.match(missingHtml, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i);
assert.equal(canonicalFrom(missingHtml), null, "unknown page must not have canonical");

const missingAsset = await request("/_next/static/not-a-real-asset.js");
assert.equal(missingAsset.status, 404, "unknown asset status");

for (const [pathname, location] of [
  ["/services/performance?utm_source=qa", `${canonicalBase}/services/yandex-direct?utm_source=qa`],
  ["/about.html", `${canonicalBase}/about`],
  ["/about/", `${canonicalBase}/about`],
]) {
  const response = await request(pathname);
  assert.equal(response.status, 308, `${pathname} redirect status`);
  assert.equal(response.headers.get("location"), location, `${pathname} redirect location`);
}

const home = await request("/");
for (const name of [
  "content-security-policy",
  "permissions-policy",
  "referrer-policy",
  "strict-transport-security",
  "x-content-type-options",
  "x-frame-options",
]) {
  assert.ok(home.headers.get(name), `missing security header: ${name}`);
}
const homeHtml = await home.text();
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

const video = await request("/ambient-bg-desktop.mp4", {
  headers: { Range: "bytes=0-1023" },
});
assert.equal(video.status, 206, "video range status");
assert.match(video.headers.get("content-type") || "", /^video\//i, "video content type");

console.log(`PASS ${base.origin}: ${canonicalUrls.length} SEO URLs, ${assets.length} assets, redirects, 404, headers and video range.`);
