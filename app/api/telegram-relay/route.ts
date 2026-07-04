import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Relay-эндпоинт: принимает готовый текст сообщения и пересылает его в Telegram.
// Нужен, потому что некоторые хостинги (напр. Timeweb в РФ) не могут напрямую
// достучаться до api.telegram.org — а этот эндпоинт разворачивается там,
// где доступ к Telegram есть (напр. на Vercel), и Timeweb стучится сюда вместо Telegram.
export async function POST(req: Request) {
  const expectedSecret = process.env.TELEGRAM_RELAY_SECRET;
  if (expectedSecret) {
    const provided = req.headers.get("x-relay-secret");
    if (provided !== expectedSecret) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не заданы" }, { status: 500 });
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const text = String(body.text || "").trim().slice(0, 4000);
  if (!text) {
    return NextResponse.json({ ok: false, error: "Пустой текст" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("[telegram-relay] Telegram ошибка:", res.status, detail);
      return NextResponse.json({ ok: false, error: `Telegram ${res.status}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[telegram-relay] сетевая ошибка:", e);
    return NextResponse.json({ ok: false, error: "сетевая ошибка Telegram" }, { status: 502 });
  }
}
