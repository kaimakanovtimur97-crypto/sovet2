import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeadPayload = {
  name?: string;
  contact?: string;
  budget?: string;
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

  if (!botToken || !chatId) {
    return { attempted: false, ok: false, reason: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы" };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `🔔 Новая заявка с сайта\n\n${lines.join("\n")}`,
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

  const name = clip(data.name);
  const contact = clip(data.contact);
  const budget = clip(data.budget);
  const source = clip(data.source);

  if (!name || !contact) {
    return NextResponse.json({ ok: false, error: "Укажите имя и контакт" }, { status: 400 });
  }

  const lines = [
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    budget ? `Бюджет: ${budget}` : "",
    source ? `Источник: ${source}` : "",
  ].filter(Boolean);

  const [emailResult, telegramResult] = await Promise.all([
    sendEmail(lines, name, contact),
    sendTelegram(lines),
  ]);

  // Если ни один канал не настроен — не теряем заявку, логируем и всё равно отвечаем успехом,
  // чтобы пользователь не видел ошибку из-за незаконченной настройки на нашей стороне.
  if (!emailResult.attempted && !telegramResult.attempted) {
    console.warn("[lead] получена заявка, но ни email, ни Telegram не настроены:", { name, contact, budget, source });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const delivered = emailResult.ok || telegramResult.ok;

  if (!delivered) {
    console.error("[lead] заявка получена, но не доставлена ни в один канал:", {
      name,
      contact,
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
