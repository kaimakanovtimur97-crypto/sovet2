const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.sovet-nvrsk.ru",
  "https://sovet-nvrsk.ru",
  "https://preview.sovet-nvrsk.ru",
];

const CANONICAL_ORIGIN = "https://www.sovet-nvrsk.ru";
const CANONICAL_HOST = "www.sovet-nvrsk.ru";
const FORM_HOST = "forms.sovet-nvrsk.ru";
const DEFAULT_TIMEWEB_ORIGIN =
  "https://kaimakanovtimur97-crypto-sovet2-9d5e.twc1.net";
const REDIRECT_HOSTS = new Set([
  "sovet-nvrsk.ru",
  "sovet-novoross.ru",
  "www.sovet-novoross.ru",
]);
const DEFAULT_PREVIEW_HOSTS = new Set(["preview.sovet-nvrsk.ru"]);

const SITE_ROUTES = new Set([
  "/",
  "/about",
  "/blog",
  "/blog/landing-ili-mnogostranichny-sait",
  "/blog/metrika-crm-i-prodazhi",
  "/blog/prodvizhenie-2gis-yandex-karty-novorossiysk",
  "/blog/seo-ili-yandex-direct-novorossiysk",
  "/blog/skolko-stoit-yandex-direct-novorossiysk",
  "/cases",
  "/cases/kosmodrom-seo-structure",
  "/cases/taekwondo-novorossiysk",
  "/consent",
  "/contacts",
  "/prices",
  "/privacy",
  "/regions",
  "/regions/abinsk",
  "/regions/anapa",
  "/regions/gelendzhik",
  "/regions/krymsk",
  "/requisites",
  "/services",
  "/services/analytics",
  "/services/brand",
  "/services/local-promotion",
  "/services/marketing-support",
  "/services/seo",
  "/services/smm",
  "/services/website-development",
  "/services/yandex-direct",
  "/spasibo",
]);

const PUBLIC_FILES = new Set([
  "/ambient-bg-desktop.mp4",
  "/ambient-bg-mobile.mp4",
  "/ambient-bg-poster.webp",
  "/favicon.svg",
  "/google28b330c94cc596c9.html",
  "/og.png",
  "/robots.txt",
  "/sitemap.xml",
  "/yandex_4011d0720f083f49.html",
]);

const SITE_CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://forms.sovet-nvrsk.ru",
  "upgrade-insecure-requests",
].join("; ");

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map();

function responseHeaders(origin = "") {
  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
    "Cache-Control": "no-store, max-age=0",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Content-Type": "application/json; charset=utf-8",
    "Referrer-Policy": "no-referrer",
    "Vary": "Origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

function json(body, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin),
  });
}

function clip(value, max = 180) {
  return value == null ? "" : String(value).trim().slice(0, max);
}

function commaSeparatedSet(value, max = 1_500) {
  return new Set(
    clip(value, max)
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function normalizeRussianPhone(value) {
  let digits = clip(value, 40).replace(/\D/g, "");
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `+7${digits}`;
}

function allowedOrigins(env) {
  const extra = clip(env.ALLOWED_ORIGINS, 1_500)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...extra]);
}

function previewHosts(env) {
  return new Set([...DEFAULT_PREVIEW_HOSTS, ...commaSeparatedSet(env.PREVIEW_HOSTS)]);
}

function requestOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return allowedOrigins(env).has(origin) ? origin : null;
}

async function requestKey(request) {
  const forwarded =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For") ||
    "unknown";
  const raw = new TextEncoder().encode(forwarded.split(",")[0].trim());
  const digest = await crypto.subtle.digest("SHA-256", raw);
  return Array.from(new Uint8Array(digest))
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function isRateLimited(request) {
  const now = Date.now();
  const key = await requestKey(request);
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

async function sendEmail(env, lines) {
  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL) {
    return { ok: false, reason: "email_not_configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          env.LEAD_FROM_EMAIL ||
          "Заявки с сайта <onboarding@resend.dev>",
        to: [env.LEAD_TO_EMAIL],
        subject: "Новая заявка с сайта «Совет Маркетинг»",
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("[lead] Resend delivery failed", response.status);
      return { ok: false, reason: `resend_${response.status}` };
    }

    return { ok: true };
  } catch {
    console.error("[lead] Resend network failure");
    return { ok: false, reason: "resend_network" };
  }
}

async function handleLead(request, env, origin) {
  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, delivered: false, error: "Ожидается JSON." }, 415, origin);
  }

  const declaredLength = Number(request.headers.get("Content-Length") || 0);
  if (declaredLength > 8_192) {
    return json({ ok: false, delivered: false, error: "Слишком большой запрос." }, 413, origin);
  }

  if (await isRateLimited(request)) {
    return json(
      { ok: false, delivered: false, error: "Слишком много попыток. Попробуйте позже." },
      429,
      origin,
    );
  }

  const rawBody = await request.arrayBuffer();
  if (rawBody.byteLength > 8_192) {
    return json({ ok: false, delivered: false, error: "Слишком большой запрос." }, 413, origin);
  }

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return json({ ok: false, delivered: false, error: "Некорректный запрос." }, 400, origin);
  }

  if (clip(payload.website, 200)) {
    return json({ ok: true, delivered: false, spam: true }, 202, origin);
  }

  const phone = normalizeRussianPhone(payload.phone);
  if (!phone) {
    return json(
      { ok: false, delivered: false, error: "Укажите корректный российский номер." },
      400,
      origin,
    );
  }

  if (payload.consent !== true) {
    return json(
      { ok: false, delivered: false, error: "Необходимо согласие на обработку номера телефона." },
      400,
      origin,
    );
  }

  const leadId = crypto.randomUUID();
  const source = clip(payload.source, 160) || "Сайт";
  const consentVersion = clip(payload.consentVersion, 20) || "не указана";
  const delivery = await sendEmail(env, [
    `ID: ${leadId}`,
    `Телефон: ${phone}`,
    `Источник: ${source}`,
    `Согласие: подтверждено, версия ${consentVersion}`,
    `Время сервера: ${new Date().toISOString()}`,
  ]);

  if (!delivery.ok) {
    console.error("[lead] Delivery failed", { leadId, reason: delivery.reason });
    const status = delivery.reason === "email_not_configured" ? 503 : 502;
    return json(
      { ok: false, delivered: false, error: "Не удалось подтвердить доставку заявки." },
      status,
      origin,
    );
  }

  return json(
    { ok: true, delivered: true, leadId, channels: { email: true, telegram: false } },
    200,
    origin,
  );
}

function canonicalRedirect(request, pathname = new URL(request.url).pathname) {
  const source = new URL(request.url);
  const target = new URL(pathname, CANONICAL_ORIGIN);
  target.search = source.search;
  return new Response(null, {
    status: 308,
    headers: {
      "Cache-Control": "public, max-age=3600",
      Location: target.toString(),
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function siteOrigin(env) {
  const value = clip(env.TIMEWEB_ORIGIN, 500) || DEFAULT_TIMEWEB_ORIGIN;
  const url = new URL(value);
  if (url.protocol !== "https:") throw new Error("TIMEWEB_ORIGIN must use HTTPS");
  return url;
}

function isAssetPath(pathname) {
  return pathname.startsWith("/_next/") || PUBLIC_FILES.has(pathname) || pathname.endsWith(".txt");
}

function isImmutableAsset(pathname) {
  return pathname.startsWith("/_next/static/");
}

function siteHeaders(source, { pathname = "/", notFound = false } = {}) {
  const headers = new Headers(source);
  headers.delete("server");
  headers.set("Content-Security-Policy", SITE_CSP);
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Strict-Transport-Security", "max-age=31536000");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");

  if (notFound) {
    headers.set("Cache-Control", "no-store, max-age=0");
    headers.set("X-Robots-Tag", "noindex, nofollow");
  } else if (isImmutableAsset(pathname)) {
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
  } else if (pathname.endsWith(".mp4") || pathname.endsWith(".webp") || pathname.endsWith(".png")) {
    headers.set("Cache-Control", "public, max-age=86400");
  } else {
    headers.set("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=86400");
  }

  return headers;
}

async function originFetch(request, env, pathname) {
  const target = siteOrigin(env);
  target.pathname = pathname;
  target.search = new URL(request.url).search;

  const headers = new Headers(request.headers);
  headers.delete("authorization");
  headers.delete("cookie");
  headers.delete("host");

  const fetcher = typeof env.__TEST_FETCH === "function" ? env.__TEST_FETCH : fetch;
  return fetcher(target.toString(), {
    method: request.method,
    headers,
    redirect: "manual",
  });
}

async function notFoundResponse(request, env) {
  try {
    const upstream = await originFetch(request, env, "/404.html");
    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: 404,
      headers: siteHeaders(upstream.headers, { pathname: "/404", notFound: true }),
    });
  } catch {
    return new Response("Страница не найдена.", {
      status: 404,
      headers: siteHeaders({ "Content-Type": "text/plain; charset=utf-8" }, { notFound: true }),
    });
  }
}

async function proxySite(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Метод не разрешён.", {
      status: 405,
      headers: siteHeaders({ Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" }),
    });
  }

  if (pathname === "/services/performance" || pathname === "/services/performance/") {
    return canonicalRedirect(request, "/services/yandex-direct");
  }

  if (pathname === "/404" || pathname === "/404.html" || pathname.startsWith("/_not-found")) {
    return notFoundResponse(request, env);
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return canonicalRedirect(request, pathname.slice(0, -1));
  }

  if (pathname.endsWith(".html") && !PUBLIC_FILES.has(pathname)) {
    const cleanPath = pathname.slice(0, -5) || "/";
    return SITE_ROUTES.has(cleanPath)
      ? canonicalRedirect(request, cleanPath)
      : notFoundResponse(request, env);
  }

  const isPage = SITE_ROUTES.has(pathname);
  const isAsset = isAssetPath(pathname);
  if (!isPage && !isAsset) return notFoundResponse(request, env);

  try {
    const originPath = isPage ? (pathname === "/" ? "/index.html" : `${pathname}.html`) : pathname;
    const upstream = await originFetch(request, env, originPath);
    const contentType = upstream.headers.get("Content-Type") || "";
    if (!upstream.ok || (isAsset && contentType.toLowerCase().includes("text/html"))) {
      return notFoundResponse(request, env);
    }

    return new Response(request.method === "HEAD" ? null : upstream.body, {
      status: upstream.status,
      headers: siteHeaders(upstream.headers, { pathname }),
    });
  } catch {
    return new Response("Сайт временно недоступен.", {
      status: 502,
      headers: siteHeaders(
        { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "30" },
        { notFound: true },
      ),
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (REDIRECT_HOSTS.has(url.hostname)) {
      return canonicalRedirect(request);
    }

    if (url.hostname === CANONICAL_HOST || previewHosts(env).has(url.hostname)) {
      return proxySite(request, env);
    }

    if (url.hostname !== FORM_HOST) {
      return json({ ok: false, error: "Не найдено." }, 404);
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return json({ ok: true, service: "sovet-lead" });
    }

    if (url.pathname !== "/api/lead") {
      return json({ ok: false, error: "Не найдено." }, 404);
    }

    const origin = requestOrigin(request, env);
    if (!origin) {
      return json({ ok: false, delivered: false, error: "Источник запроса не разрешён." }, 403);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }

    if (request.method !== "POST") {
      return json({ ok: false, delivered: false, error: "Метод не разрешён." }, 405, origin);
    }

    return handleLead(request, env, origin);
  },
};
