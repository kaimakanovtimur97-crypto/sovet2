"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sovet-cookie-notice";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
      } catch {
        setVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function acceptNotice() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // The notice can still be dismissed when storage is unavailable.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-notice" aria-label="Уведомление о cookie">
      <div>
        <strong>На сайте используются технические cookie</strong>
        <p>
          Они нужны для корректной работы сайта и сохранения вашего выбора.
          Необязательные аналитические cookie сейчас не устанавливаются.
        </p>
        <Link href="/privacy#cookies">Подробнее в политике</Link>
      </div>
      <button type="button" onClick={acceptNotice}>Понятно</button>
    </aside>
  );
}
