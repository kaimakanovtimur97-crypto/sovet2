"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Check, Send } from "lucide-react";
import { site } from "@/lib/site-data";

type FormState = "idle" | "sending" | "error";

function formatPhone(value: string) {
  const raw = value.replace(/\D/g, "");
  const digits = (raw.length > 10 && /^[78]/.test(raw) ? raw.slice(1) : raw).slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 8) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
}

export function LeadForm({ source = "Сайт" }: { source?: string }) {
  const formId = useId();
  const [phone, setPhone] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10 || !accepted) {
      setFormState("error");
      setErrorMessage(
        digits.length !== 10
          ? "Введите российский номер из 10 цифр."
          : "Подтвердите согласие на обработку данных.",
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setFormState("sending");
    setErrorMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+7 ${phone}`,
          source,
          consent: true,
          consentVersion: "2026-08-07",
          website: String(formData.get("website") || ""),
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok || result?.delivered !== true) {
        throw new Error(result?.error || "Не удалось подтвердить доставку заявки.");
      }

      try {
        window.sessionStorage.setItem(
          "sovet-lead-success",
          JSON.stringify({ leadId: result.leadId, createdAt: Date.now() }),
        );
      } catch {
        // Redirect remains valid when session storage is unavailable.
      }
      window.location.assign("/spasibo");
    } catch (error) {
      setFormState("error");
      setErrorMessage(error instanceof Error ? error.message : "Не удалось отправить заявку.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`phone-${formId}`}>Номер телефона</label>
      <div className="phone-field">
        <span>+7</span>
        <input
          id={`phone-${formId}`}
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="(918) 000-00-00"
          value={phone}
          onChange={(event) => {
            setPhone(formatPhone(event.target.value));
            setFormState("idle");
            setErrorMessage("");
          }}
          aria-invalid={formState === "error" && phone.replace(/\D/g, "").length !== 10}
          required
        />
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor={`website-${formId}`}>Ваш сайт</label>
        <input id={`website-${formId}`} name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>
      <label className="consent-check">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => {
            setAccepted(event.target.checked);
            setFormState("idle");
            setErrorMessage("");
          }}
          required
        />
        <span>
          Даю <Link href="/consent">согласие на обработку номера телефона</Link> и ознакомлен(а) с{" "}
          <Link href="/privacy">политикой</Link>.
        </span>
      </label>
      <button className="pill-button" type="submit" disabled={formState === "sending"}>
        {formState === "sending" ? "Отправляем…" : "Отправить заявку"}
        {formState === "sending" ? <Check size={17} /> : <Send size={17} />}
      </button>
      <div className="form-status" role="status" aria-live="polite">
        {formState === "error" ? (
          <>
            {errorMessage} Можно позвонить: <a href={site.phoneHref}>{site.phone}</a>.
          </>
        ) : (
          "После подтверждённой доставки откроется страница благодарности."
        )}
      </div>
    </form>
  );
}
