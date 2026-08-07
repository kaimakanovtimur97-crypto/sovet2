import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_RELAY_SECRET;
  if (!expectedSecret) {
    return json({ ok: false, error: "Relay не настроен." }, 503);
  }
  if (request.headers.get("x-relay-secret") !== expectedSecret) {
    return json({ ok: false, error: "Доступ запрещён." }, 401);
  }
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Ожидается JSON." }, 415);
  }
  if (Number(request.headers.get("content-length") || 0) > 8_192) {
    return json({ ok: false, error: "Слишком большой запрос." }, 413);
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    return json({ ok: false, error: "Канал Telegram не настроен." }, 503);
  }

  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Некорректный запрос." }, 400);
  }

  const text = String(body.text || "").trim().slice(0, 3_000);
  if (!text) return json({ ok: false, error: "Пустой текст." }, 400);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!response.ok) {
      console.error("[telegram-relay] Telegram delivery failed", response.status);
      return json({ ok: false, error: "Telegram не подтвердил доставку." }, 502);
    }
    return json({ ok: true, delivered: true });
  } catch {
    console.error("[telegram-relay] Telegram network failure");
    return json({ ok: false, error: "Сетевая ошибка Telegram." }, 502);
  }
}
