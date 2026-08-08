import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import leadWorker from "../cloudflare/lead-worker.js";

const out = new URL("../out/", import.meta.url);
const canonicalBase = "https://www.sovet-nvrsk.ru";

async function text(relativePath) {
  return readFile(new URL(relativePath, out), "utf8");
}

function htmlFileForUrl(url) {
  const pathname = new URL(url).pathname;
  return pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`;
}

test("all sitemap URLs have exported HTML, one H1 and a self-canonical", async () => {
  const sitemap = await text("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 28);

  for (const url of urls) {
    const html = await text(htmlFileForUrl(url));
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, url);
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), url);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, url);
  }
});

test("utility pages are noindex and the exported 404 is a real noindex document", async () => {
  for (const file of ["privacy.html", "consent.html", "spasibo.html", "404.html"]) {
    const html = await text(file);
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, file);
  }

  const notFound = await text("404.html");
  assert.doesNotMatch(notFound, /rel="canonical"/i);
});

test("robots and the client bundle use canonical production endpoints", async () => {
  const robots = await text("robots.txt");
  assert.match(robots, /Sitemap:\s*https:\/\/www\.sovet-nvrsk\.ru\/sitemap\.xml/i);
  assert.match(robots, /Host:\s*www\.sovet-nvrsk\.ru/i);

  const chunksDir = new URL("../out/_next/static/chunks/", import.meta.url);
  const chunks = await readdir(chunksDir);
  const scripts = await Promise.all(
    chunks.filter((file) => file.endsWith(".js")).map((file) => readFile(new URL(file, chunksDir), "utf8")),
  );
  const bundle = scripts.join("\n");
  assert.match(bundle, /https:\/\/forms\.sovet-nvrsk\.ru\/api\/lead/);
  assert.doesNotMatch(bundle, /sovet2\.kaimakanovtimur97\.workers\.dev\/api\/lead/);
});

test("lead Worker rejects foreign origins and only accepts configured delivery", async () => {
  const foreign = await leadWorker.fetch(
    new Request("https://forms.sovet-nvrsk.ru/api/lead", {
      method: "POST",
      headers: { Origin: "https://evil.example", "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "+7 918 000-00-00", consent: true }),
    }),
    {},
  );
  assert.equal(foreign.status, 403);

  const preflight = await leadWorker.fetch(
    new Request("https://forms.sovet-nvrsk.ru/api/lead", {
      method: "OPTIONS",
      headers: { Origin: canonicalBase },
    }),
    {},
  );
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), canonicalBase);

  const noChannel = await leadWorker.fetch(
    new Request("https://forms.sovet-nvrsk.ru/api/lead", {
      method: "POST",
      headers: { Origin: canonicalBase, "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: "+7 918 000-00-00",
        source: "test",
        consent: true,
        consentVersion: "2026-08-07",
      }),
    }),
    {},
  );
  assert.equal(noChannel.status, 503);
  assert.deepEqual(await noChannel.json(), {
    ok: false,
    delivered: false,
    error: "Не удалось подтвердить доставку заявки.",
  });
});

test("static export contains no server API directory", async () => {
  const entries = await readdir(out);
  assert.equal(entries.includes("api"), false);
});
