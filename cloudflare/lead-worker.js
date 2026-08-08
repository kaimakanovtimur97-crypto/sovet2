const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.sovet-nvrsk.ru",
  "https://sovet-nvrsk.ru",
];

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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
