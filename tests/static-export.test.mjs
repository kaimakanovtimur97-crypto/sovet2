import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const out = new URL("../out/", import.meta.url);
const canonicalBase = "https://sovet-novoross.ru";

async function text(relativePath) {
  return readFile(new URL(relativePath, out), "utf8");
}

function htmlFileForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return "index.html";
  return `${pathname.replace(/^\/+|\/+$/g, "")}/index.html`;
}

async function listFiles(directory, prefix = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const relative = path.posix.join(prefix, entry.name);
    return entry.isDirectory()
      ? listFiles(new URL(`${entry.name}/`, directory), relative)
      : [relative];
  }));
  return nested.flat();
}

test("all sitemap URLs have directory exports, one H1 and a self-canonical", async () => {
  const sitemap = await text("sitemap.xml");
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.equal(urls.length, 29);

  for (const url of urls) {
    assert.ok(url === canonicalBase || url.endsWith("/"), `${url} must follow the slash policy`);
    const html = await text(htmlFileForUrl(url));
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, url);
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`), url);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, url);
  }
});

test("privacy, Nexum showcase and 404 are noindex; removed form routes are absent", async () => {
  for (const file of ["privacy/index.html", "nexum/index.html", "404.html"]) {
    const html = await text(file);
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, file);
  }

  await assert.rejects(access(new URL("consent/index.html", out)));
  await assert.rejects(access(new URL("spasibo/index.html", out)));

  const notFound = await text("404.html");
  assert.doesNotMatch(notFound, /rel="canonical"/i);
});

test("Nexum is a Russian authored showcase without invented results", async () => {
  const caseHtml = await text("cases/nexum-ai-ops/index.html");
  const showcaseHtml = await text("nexum/index.html");
  const sitemap = await text("sitemap.xml");

  assert.match(caseHtml, /Одноэкранный SaaS-лендинг для AI-операций/i);
  assert.match(caseHtml, /href="\/nexum\/?"/i);
  assert.match(caseHtml, /Кейс подтверждает дизайн и реализацию интерактивного прототипа/i);
  assert.match(showcaseHtml, /ИИ-сотрудники берут рутину на себя/i);
  assert.match(showcaseHtml, /Обсудить такой сайт/i);
  assert.doesNotMatch(`${caseHtml}\n${showcaseHtml}`, /42[,.\s]?500\+|Sara Klein|Stratify|Ship AI workers|Get started/i);
  assert.match(sitemap, /\/cases\/nexum-ai-ops\//i);
  assert.doesNotMatch(sitemap, /\/nexum\//i);
});

test("robots, HTML and bundles use only the new production domain and contacts", async () => {
  const robots = await text("robots.txt");
  assert.match(robots, /Sitemap:\s*https:\/\/sovet-novoross\.ru\/sitemap\.xml/i);
  assert.match(robots, /Host:\s*sovet-novoross\.ru/i);

  const files = await listFiles(out);
  const searchable = files.filter((file) => /\.(?:html|xml|txt|js)$/i.test(file));
  const contents = await Promise.all(searchable.map((file) => text(file)));
  const bundle = contents.join("\n");

  assert.doesNotMatch(bundle, /sovet-nvrsk\.ru/i);
  assert.doesNotMatch(bundle, /forms\.sovet|\/api\/lead|Отправить заявку/i);
  assert.match(bundle, /\+7 995 263 15 53/);
  assert.match(bundle, /https:\/\/t\.me\/\+79952631553/);
  assert.match(bundle, /https:\/\/wa\.me\/79952631553/);
});

test("homepage and contacts expose direct channels without a lead form", async () => {
  const home = await text("index.html");
  const contacts = await text("contacts/index.html");
  const normalizedHome = home.replaceAll("<!-- -->", "");

  for (const html of [home, contacts]) {
    assert.doesNotMatch(html, /<form\b/i);
    assert.doesNotMatch(html, /<input\b/i);
    assert.match(html, /tel:\+79952631553/);
    assert.match(html, /Telegram/);
    assert.match(html, /WhatsApp/);
    assert.match(html, /MAX/);
  }

  assert.match(normalizedHome, />7 лет</);
  assert.match(normalizedHome, />1–2 недели</);
  assert.match(normalizedHome, />400\+</);
  assert.match(normalizedHome, /кабинеты и данные у вас/);
  assert.doesNotMatch(normalizedHome, /Демо|демо|Концепт|концепт/);
});

test("static export contains no server API directory", async () => {
  const entries = await readdir(out);
  assert.equal(entries.includes("api"), false);
});
