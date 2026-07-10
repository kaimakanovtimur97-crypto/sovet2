"use client";

import React, { useState } from "react";
import { Icon } from "./Icon";
import { formatRuPhone, isCompleteRuPhone } from "./phone";

export function InlineLeadForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  if (sent) {
    return (
      <div className="thanks">
        <div className="thanks-ic">
          <Icon name="check" size={28} />
        </div>
        <h3>Заявка отправлена</h3>
        <p>Перезвоним вам в ближайшее время.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isCompleteRuPhone(phone)) {
      setError("Укажите номер телефона полностью.");
      return;
    }
    const payload = {
      phone,
      source: "Форма в блоке контактов",
    };
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз или позвоните нам напрямую.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="cta-phone">Номер телефона</label>
        <div className="input-wrap">
          <span className="input-ic">
            <Icon name="phone" size={16} />
          </span>
          <input
            id="cta-phone"
            name="phone"
            className="input has-ic"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(formatRuPhone(e.target.value))}
            required
          />
        </div>
      </div>
      {error && (
        <p style={{ color: "#ff6b6b", fontSize: 13, margin: 0 }}>{error}</p>
      )}
      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={sending}>
        {sending ? "Отправляем…" : "Отправить заявку"}
        <Icon name="arrowRight" size={18} />
      </button>
    </form>
  );
}
