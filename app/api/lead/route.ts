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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "Заявки с сайта <onboarding@resend.dev>";

  // Если почта ещё не настроена — не теряем заявку, логируем и отвечаем успехом.
  if (!apiKey || !to) {
    console.warn("[lead] получена заявка, но RESEND_API_KEY/LEAD_TO_EMAIL не заданы:", {
      name,
      contact,
      budget,
      source,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const lines = [
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    budget ? `Бюджет: ${budget}` : "",
    source ? `Источник: ${source}` : "",
  ].filter(Boolean);

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
      return NextResponse.json({ ok: false, error: "Не удалось отправить письмо" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (e) {
    console.error("[lead] сетевая ошибка:", e);
    return NextResponse.json({ ok: false, error: "Ошибка отправки" }, { status: 500 });
  }
}
