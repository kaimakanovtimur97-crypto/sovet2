import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  phone?: string;
  // Старые поля оставлены для совместимости со старыми версиями формы
  name?: string;
  contact?: string;
  source?: string;
};

const clip = (v: unknown, max = 300) => (v == null ? "" : String(v).trim().slice(0, max));

async function sendEmail(lines: string[], name: string, contact: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "Заявки с сайта <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { attempted: false, ok: false, reason: "RESEND_API_KEY/LEAD_TO_EMAIL не заданы" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Заявка с сайта: ${name}`,
        reply_to: contact.includes("@") ? contact : undefined,
        text: lines.join("\n"),
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[lead] Resend ошибка:", res.status, detail);
      return { attempted: true, ok: false, reason: `Resend ${res.status}` };
    }
    return { attempted: true, ok: true };
  } catch (e) {
    console.error("[lead] Resend сетевая ошибка:", e);
    return { attempted: true, ok: false, reason: "сетевая ошибка Resend" };
  }
}

async function sendTelegram(lines: string[]) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const relayUrl = process.env.TELEGRAM_RELAY_URL;
  const relaySecret = process.env.TELEGRAM_RELAY_SECRET;
  const text = `🔔 Новая заявка с сайта\n\n${lines.join("\n")}`;

  // Некоторые российские хостинги (напр. Timeweb) не могут напрямую достучаться
  // до api.telegram.org (сеть блокирует). В этом случае заявка отправляется
  // через relay-эндпоинт (/api/telegram-relay), развёрнутый там, где Telegram доступен напрямую.
  if (relayUrl) {
    try {
      const res = await fetch(relayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(relaySecret ? { "x-relay-secret": relaySecret } : {}),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("[lead] Telegram relay ошибка:", res.status, detail);
        return { attempted: true, ok: false, reason: `Telegram relay ${res.status}` };
      }
      return { attempted: true, ok: true };
    } catch (e) {
      console.error("[lead] Telegram relay сетевая ошибка:", e);
      return { attempted: true, ok: false, reason: "сетевая ошибка Telegram relay" };
    }
  }

  if (!botToken || !chatId) {
    return { attempted: false, ok: false, reason: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[lead] Telegram ошибка:", res.status, detail);
      return { attempted: true, ok: false, reason: `Telegram ${res.status}` };
    }
    return { attempted: true, ok: true };
  } catch (e) {
    console.error("[lead] Telegram сетевая ошибка:", e);
    return { attempted: true, ok: false, reason: "сетевая ошибка Telegram" };
  }
}

export async function POST(req: Request) {
  let data: LeadPayload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const phone = clip(data.phone || data.contact);
  const name = clip(data.name);
  const source = clip(data.source);

  if (!phone) {
    return NextResponse.json({ ok: false, error: "Укажите номер телефона" }, { status: 400 });
  }

  const lines = [
    `Телефон: ${phone}`,
    name ? `Имя: ${name}` : "",
    source ? `Источник: ${source}` : "",
  ].filter(Boolean);

  const [emailResult, telegramResult] = await Promise.all([
    sendEmail(lines, phone, phone),
    sendTelegram(lines),
  ]);

  // Если ни один канал не настроен — не теряем заявку, логируем и всё равно отвечаем успехом,
  // чтобы пользователь не видел ошибку из-за незаконченной настройки на нашей стороне.
  if (!emailResult.attempted && !telegramResult.attempted) {
    console.warn("[lead] получена заявка, но ни email, ни Telegram не настроены:", { phone, name, source });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const delivered = emailResult.ok || telegramResult.ok;

  if (!delivered) {
    console.error("[lead] заявка получена, но не доставлена ни в один канал:", {
      phone,
      email: emailResult,
      telegram: telegramResult,
    });
    return NextResponse.json({ ok: false, error: "Не удалось отправить заявку" }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    delivered: true,
    channels: { email: emailResult.ok, telegram: telegramResult.ok },
  });
}
