"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  OPEN_COOKIE_SETTINGS_EVENT,
  type AnalyticsConsent,
} from "@/lib/analytics";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
        setVisible(value !== "analytics" && value !== "necessary");
      } catch {
        setVisible(true);
      }
    });

    function openSettings() {
      setVisible(true);
    }

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    };
  }, []);

  function saveConsent(consent: AnalyticsConsent) {
    let previous: string | null = null;
    try {
      previous = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
    } catch {
      // The choice still applies to the current page when storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, {
      detail: { consent },
    }));
    setVisible(false);

    if (previous === "analytics" && consent === "necessary") {
      window.location.reload();
    }
  }

  if (!visible) return null;

  return (
    <aside className="cookie-notice" aria-label="Уведомление о cookie">
      <div>
        <strong>Настройки cookie и аналитики</strong>
        <p>
          Техническое хранилище сохраняет ваш выбор. Яндекс Метрика,
          Вебвизор и аналитические cookie включаются только с вашего разрешения.
        </p>
        <Link href="/privacy#cookies">Подробнее в политике</Link>
      </div>
      <div className="cookie-notice-actions">
        <button className="cookie-secondary" type="button" onClick={() => saveConsent("necessary")}>
          Только необходимые
        </button>
        <button type="button" onClick={() => saveConsent("analytics")}>
          Разрешить аналитику
        </button>
      </div>
    </aside>
  );
}
