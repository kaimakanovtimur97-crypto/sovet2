"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Icon } from "./Icon";
import { formatRuPhone, isCompleteRuPhone } from "./phone";

type LeadContextType = { open: () => void };
const LeadCtx = createContext<LeadContextType>({ open: () => {} });

export function useLead() {
  return useContext(LeadCtx);
}

function FormFields({ onSent }: { onSent: () => void }) {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isCompleteRuPhone(phone)) {
      setError("Укажите номер телефона полностью.");
      return;
    }
    const payload = {
      phone,
      source: "Модальная форма «Получить стратегию роста»",
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
      onSent();
    } catch {
      setError("Не удалось отправить. Попробуйте ещё раз или позвоните нам напрямую.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="lead-phone">Номер телефона</label>
        <div className="input-wrap">
          <span className="input-ic">
            <Icon name="phone" size={16} />
          </span>
          <input
            id="lead-phone"
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
      {error && <p style={{ color: "#ff6b6b", fontSize: 13, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={sending}>
        {sending ? "Отправляем…" : "Отправить заявку"}
        <Icon name="arrowRight" size={18} />
      </button>
    </form>
  );
}

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const open = useCallback(() => {
    setSent(false);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <LeadCtx.Provider value={{ open }}>
      {children}
      {isOpen && (
        <div className="modal-ov" onClick={close}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                background: "radial-gradient(420px 200px at 100% 0%, var(--accent-glow), transparent 65%)",
                pointerEvents: "none",
              }}
            />
            <button className="modal-close" onClick={close} aria-label="Закрыть">
              <Icon name="x" size={18} />
            </button>
            <div style={{ position: "relative" }}>
              {sent ? (
                <div className="thanks">
                  <div className="thanks-ic">
                    <Icon name="check" size={28} />
                  </div>
                  <h3>Заявка отправлена</h3>
                  <p style={{ maxWidth: 300 }}>Перезвоним вам в течение рабочего дня.</p>
                  <button className="btn btn--outline" onClick={close}>
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <span className="eyebrow" style={{ marginBottom: 14 }}>
                    <Icon name="sparkles" size={14} /> Бесплатно за 3 дня
                  </span>
                  <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--fg-0)", margin: "0 0 8px" }}>
                    Получить стратегию роста
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.55, color: "var(--fg-2)", margin: "0 0 24px" }}>
                    Разбор воронки и план первых гипотез. Без воды и презентаций ради презентаций.
                  </p>
                  <FormFields onSent={() => setSent(true)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </LeadCtx.Provider>
  );
}

export function ConsultButton({
  children,
  variant = "primary",
  size,
  block,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "lg";
  block?: boolean;
}) {
  const { open } = useLead();
  const cls = ["btn", `btn--${variant}`, size === "lg" ? "btn--lg" : "", block ? "btn--block" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={cls} onClick={open}>
      {children}
      <Icon name="arrowRight" size={size === "lg" ? 18 : 16} />
    </button>
  );
}
