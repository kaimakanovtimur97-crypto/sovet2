"use client";

import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/analytics";

export function CookieSettingsButton() {
  return (
    <button
      className="footer-link-button"
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      Настройки cookie
    </button>
  );
}
