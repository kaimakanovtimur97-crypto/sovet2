"use client";

import React, { useState } from "react";
import { Icon } from "./Icon";

export function InlineLeadForm() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  if (sent) {
    return (
      <div className="thanks">
        <div className="thanks-ic">
          <Icon name="check" size={28} />
        </div>
        <h3>{name ? `Спасибо, ${name}!` : "Заявка отправлена"}</h3>
        <p>Свяжемся с вами в ближайшее время.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || ""),
      contact: String(fd.get("contact") || ""),
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
      setName(payload.name.trim());
      setSent(true);
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз или напишите нам напрямую.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="cta-name">Имя</label>
        <div className="input-wrap">
          <input
            id="cta-name"
            name="name"
            className="input"
            type="text"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="cta-contact">Эл. почта или телефон</label>
        <div className="input-wrap">
          <span className="input-ic">
            <Icon name="mail" size={16} />
          </span>
          <input
            id="cta-contact"
            name="contact"
            className="input has-ic"
            type="text"
            placeholder="you@company.ru"
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
