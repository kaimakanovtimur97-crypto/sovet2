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
    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
    } catch {
      // The choice still applies to the current page when storage is unavailable.
    }

    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, {
      detail: { consent },
    }));
    setVisible(false);

  }

  if (!visible) return null;

  return (
    <aside className="cookie-notice" aria-label="Уведомление о cookie">
      <div>
        <strong>Настройки cookie и аналитики</strong>
        <p>
          Яндекс Метрика и Вебвизор включаются при открытии сайта, если вы
          ранее не отключили аналитику. Они помогают оценивать посещаемость
          и действия на страницах. Вы можете отключить дальнейший сбор данных.
        </p>
        <Link href="/privacy#cookies">Подробнее в политике</Link>
      </div>
      <div className="cookie-notice-actions">
        <button className="cookie-secondary" type="button" onClick={() => saveConsent("necessary")}>
          Отключить аналитику
        </button>
        <button type="button" onClick={() => saveConsent("analytics")}>
          Понятно
        </button>
      </div>
    </aside>
  );
}
