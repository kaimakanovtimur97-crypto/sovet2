import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const out = new URL("out/", root);
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
  assert.equal(urls.length, 27);

  for (const url of urls) {
    assert.ok(url === canonicalBase || url.endsWith("/"), `${url} must follow the slash policy`);
    const html = await text(htmlFileForUrl(url));
    const expectedCanonical = url === canonicalBase ? `${canonicalBase}/` : url;
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, url);
    assert.match(html, new RegExp(`<link[^>]+rel="canonical"[^>]+href="${expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), url);
    assert.doesNotMatch(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, url);
  }
});

test("privacy, Nexum showcase and 404 are noindex; removed routes are absent", async () => {
  for (const file of ["privacy/index.html", "nexum/index.html", "404.html"]) {
    const html = await text(file);
    assert.match(html, /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i, file);
  }

  await assert.rejects(access(new URL("consent/index.html", out)));
  await assert.rejects(access(new URL("spasibo/index.html", out)));
  await assert.rejects(access(new URL("regions/krymsk/index.html", out)));
  await assert.rejects(access(new URL("regions/abinsk/index.html", out)));

  const sitemap = await text("sitemap.xml");
  assert.doesNotMatch(sitemap, /\/regions\/(?:krymsk|abinsk)\//i);

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
  assert.match(showcaseHtml, /nexum-hero-mobile\.mp4/i);
  assert.match(showcaseHtml, /max-width:\s*767px/i);
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

  assert.doesNotMatch(bundle, /(?:www\.)?sovet-nvrsk\.ru/i);
  assert.doesNotMatch(bundle, /www\.sovet-novoross\.ru/i);
  assert.match(bundle, /https:\/\/sovet-novoross\.ru/i);
  assert.doesNotMatch(bundle, /forms\.sovet|\/api\/lead|Отправить заявку/i);
  assert.match(bundle, /\+7 995 263 15 53/);
  assert.match(bundle, /https:\/\/t\.me\/\+79952631553/);
  assert.match(bundle, /https:\/\/wa\.me\/79952631553/);
});

test("Metrika is consent-gated and exposes contact goals", async () => {
  const home = await text("index.html");
  const privacy = await text("privacy/index.html");
  const files = await listFiles(out);
  const scripts = files.filter((file) => file.endsWith(".js"));
  const scriptBundle = (await Promise.all(scripts.map((file) => text(file)))).join("\n");

  assert.doesNotMatch(home, /<script[^>]+src="https:\/\/mc\.yandex\.ru/i);
  assert.doesNotMatch(home, /mc\.yandex\.ru\/watch\/111627787/i);
  assert.match(scriptBundle, /metrika\/tag\.js\?id=/);
  assert.match(scriptBundle, /YANDEX_METRIKA_ID/);
  assert.match(scriptBundle, /sovet-analytics-consent-v1/);
  assert.match(scriptBundle, /disableYaCounter/);
  assert.match(scriptBundle, /contact_phone/);
  assert.match(scriptBundle, /contact_telegram/);
  assert.match(scriptBundle, /contact_whatsapp/);
  assert.match(scriptBundle, /contact_max/);
  assert.match(privacy, /Яндекс Метрика/i);
  assert.match(privacy, /111627787/);
  assert.match(privacy, /Разрешить аналитику/i);
});

test("the main visual keeps desktop video out of the mobile loading path and uses lean fonts", async () => {
  const files = await listFiles(out);
  const scripts = files.filter((file) => file.endsWith(".js"));
  const styles = files.filter((file) => file.endsWith(".css"));
  const scriptBundle = (await Promise.all(scripts.map((file) => text(file)))).join("\n");
  const styleBundle = (await Promise.all(styles.map((file) => text(file)))).join("\n");
  const home = await text("index.html");

  assert.match(scriptBundle, /ambient-bg-desktop\.mp4/);
  assert.doesNotMatch(scriptBundle, /ambient-bg-mobile\.mp4/);
  assert.doesNotMatch(styleBundle, /JetBrains Mono/i);
  assert.doesNotMatch(styleBundle, /font-family:\s*Inter/i);
  assert.equal((home.match(/rel="preload"[^>]+as="font"/gi) || []).length, 0);
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

test("static export keeps 404 and security rules while Cloudflare stays redirect-only", async () => {
  const wrangler = JSON.parse(await readFile(new URL("wrangler.jsonc", root), "utf8"));
  const headers = await text("_headers");

  assert.equal(wrangler.name, "sovet2");
  assert.equal(wrangler.main, "./cloudflare/redirect-worker.mjs");
  assert.equal(wrangler.build, undefined);
  assert.equal(wrangler.assets, undefined);
  assert.match(headers, /Content-Security-Policy:/i);
  assert.match(headers, /media-src 'self'/i);
  assert.match(headers, /script-src[^;\n]+https:\/\/mc\.yandex\.ru/i);
  assert.match(headers, /connect-src[^;\n]+https:\/\/mc\.yandex\.ru/i);
  assert.match(headers, /frame-ancestors[^;\n]+https:\/\/metrika\.yandex\.ru/i);
  assert.doesNotMatch(headers, /X-Frame-Options:\s*DENY/i);

  const desktopVideo = await stat(new URL("public/nexum/nexum-hero.mp4", root));
  const mobileVideo = await stat(new URL("public/nexum/nexum-hero-mobile.mp4", root));
  assert.ok(desktopVideo.size < 12 * 1024 * 1024, "desktop video delivery size");
  assert.ok(mobileVideo.size < 6 * 1024 * 1024, "mobile video delivery size");
  assert.ok(mobileVideo.size < desktopVideo.size, "mobile video must be the lighter source");
});
