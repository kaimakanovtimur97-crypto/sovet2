import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  phone?: string;
  source?: string;
  website?: string;
  consent?: boolean;
  consentVersion?: string;
};

type DeliveryResult = {
  attempted: boolean;
  ok: boolean;
  reason?: string;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, { count: number; resetAt: number }>();

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

function clip(value: unknown, max = 180) {
  return value == null ? "" : String(value).trim().slice(0, max);
}

function normalizeRussianPhone(value: unknown) {
  let digits = clip(value, 40).replace(/\D/g, "");
  if (digits.length === 11 && /^[78]/.test(digits)) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  return `+7${digits}`;
}

async function requestKey(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
  const raw = new TextEncoder().encode(forwarded.split(",")[0].trim());
  const digest = await crypto.subtle.digest("SHA-256", raw);
  return Array.from(new Uint8Array(digest)).slice(0, 12).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function isRateLimited(request: Request) {
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

async function sendEmail(lines: string[]): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "Заявки с сайта <onboarding@resend.dev>";
  if (!apiKey || !to) return { attempted: false, ok: false, reason: "email_not_configured" };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Новая заявка с сайта «Совет Маркетинг»",
        text: lines.join("\n"),
      }),
    });
    if (!response.ok) {
      console.error("[lead] Resend delivery failed", response.status);
      return { attempted: true, ok: false, reason: `resend_${response.status}` };
    }
    return { attempted: true, ok: true };
  } catch {
    console.error("[lead] Resend network failure");
    return { attempted: true, ok: false, reason: "resend_network" };
  }
}

async function sendTelegram(lines: string[]): Promise<DeliveryResult> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const relayUrl = process.env.TELEGRAM_RELAY_URL;
  const relaySecret = process.env.TELEGRAM_RELAY_SECRET;
  const text = `Новая заявка с сайта\n\n${lines.join("\n")}`;

  if (relayUrl) {
    try {
      const response = await fetch(relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(relaySecret ? { "x-relay-secret": relaySecret } : {}),
        },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
        console.error("[lead] Telegram relay delivery failed", response.status);
        return { attempted: true, ok: false, reason: `telegram_relay_${response.status}` };
      }
      return { attempted: true, ok: true };
    } catch {
      console.error("[lead] Telegram relay network failure");
      return { attempted: true, ok: false, reason: "telegram_relay_network" };
    }
  }

  if (!botToken || !chatId) return { attempted: false, ok: false, reason: "telegram_not_configured" };
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) {
      console.error("[lead] Telegram delivery failed", response.status);
      return { attempted: true, ok: false, reason: `telegram_${response.status}` };
    }
    return { attempted: true, ok: true };
  } catch {
    console.error("[lead] Telegram network failure");
    return { attempted: true, ok: false, reason: "telegram_network" };
  }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8_192) return json({ ok: false, delivered: false, error: "Слишком большой запрос." }, 413);
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, delivered: false, error: "Ожидается JSON." }, 415);
  }

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return json({ ok: false, delivered: false, error: "Источник запроса не разрешён." }, 403);
      }
    } catch {
      return json({ ok: false, delivered: false, error: "Некорректный источник запроса." }, 403);
    }
  }

  if (await isRateLimited(request)) {
    return json({ ok: false, delivered: false, error: "Слишком много попыток. Попробуйте позже." }, 429);
  }

  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, delivered: false, error: "Некорректный запрос." }, 400);
  }

  if (clip(payload.website, 200)) {
    return json({ ok: true, delivered: false, spam: true }, 202);
  }

  const phone = normalizeRussianPhone(payload.phone);
  if (!phone) {
    return json({ ok: false, delivered: false, error: "Укажите корректный российский номер." }, 400);
  }
  if (payload.consent !== true) {
    return json({ ok: false, delivered: false, error: "Необходимо согласие на обработку номера телефона." }, 400);
  }

  const source = clip(payload.source, 160) || "Сайт";
  const consentVersion = clip(payload.consentVersion, 20) || "не указана";
  const leadId = crypto.randomUUID();
  const lines = [
    `ID: ${leadId}`,
    `Телефон: ${phone}`,
    `Источник: ${source}`,
    `Согласие: подтверждено, версия ${consentVersion}`,
    `Время сервера: ${new Date().toISOString()}`,
  ];
  const [emailResult, telegramResult] = await Promise.all([sendEmail(lines), sendTelegram(lines)]);
  const delivered = emailResult.ok || telegramResult.ok;

  if (!emailResult.attempted && !telegramResult.attempted) {
    console.error("[lead] No delivery channel configured", { leadId });
    return json({ ok: false, delivered: false, error: "Канал доставки временно не настроен." }, 503);
  }
  if (!delivered) {
    console.error("[lead] Delivery failed", { leadId, email: emailResult.reason, telegram: telegramResult.reason });
    return json({ ok: false, delivered: false, error: "Не удалось подтвердить доставку заявки." }, 502);
  }

  return json({
    ok: true,
    delivered: true,
    leadId,
    channels: { email: emailResult.ok, telegram: telegramResult.ok },
  });
}
