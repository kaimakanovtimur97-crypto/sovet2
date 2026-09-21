"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  metrikaGoals,
  YANDEX_METRIKA_ID,
  type AnalyticsConsent,
} from "@/lib/analytics";

type Ym = (counterId: number, method: string, ...args: unknown[]) => void;

declare global {
  interface Window {
    ym?: Ym & { a?: unknown[]; l?: number };
    sovetMetrikaInitialized?: boolean;
  }
}

const disableKey = `disableYaCounter${YANDEX_METRIKA_ID}`;

function setCounterDisabled(disabled: boolean) {
  (window as unknown as Record<string, unknown>)[disableKey] = disabled;
}

function initializeMetrika() {
  if (window.sovetMetrikaInitialized) return false;

  window.ym = window.ym || Object.assign(
    (...args: unknown[]) => {
      window.ym!.a = window.ym!.a || [];
      window.ym!.a.push(args);
    },
    { l: Date.now() },
  );

  if (!document.getElementById("yandex-metrika-tag")) {
    const script = document.createElement("script");
    script.id = "yandex-metrika-tag";
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}`;
    document.head.appendChild(script);
  }

  window.ym(YANDEX_METRIKA_ID, "init", {
    defer: true,
    ssr: true,
    webvisor: true,
    clickmap: true,
    accurateTrackBounce: true,
    trackLinks: true,
  });
  window.sovetMetrikaInitialized = true;
  return true;
}

let sessionConsent: AnalyticsConsent | null | undefined;

function currentConsent(): AnalyticsConsent | null {
  if (sessionConsent !== undefined) return sessionConsent;
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "analytics" || value === "necessary" ? value : null;
  } catch {
    return null;
  }
}

function goalForLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href") || "";
  if (href.startsWith("tel:")) return metrikaGoals.phone;
  if (/^https?:\/\/(?:www\.)?t\.me\//i.test(href)) return metrikaGoals.telegram;
  if (/^https?:\/\/(?:www\.)?wa\.me\//i.test(href)) return metrikaGoals.whatsapp;
  if (/^https?:\/\/(?:www\.)?max\.ru\//i.test(href)) return metrikaGoals.max;
  return null;
}

export function YandexMetrika() {
  const pathname = usePathname();
  const previousUrl = useRef<string | null>(null);

  useEffect(() => {
    function applyConsent(consent: AnalyticsConsent | null) {
      sessionConsent = consent;
      const enabled = consent !== "necessary";
      setCounterDisabled(!enabled);
      if (!enabled && window.sovetMetrikaInitialized) {
        window.ym?.(YANDEX_METRIKA_ID, "destruct");
        window.sovetMetrikaInitialized = false;
        previousUrl.current = null;
      }
      if (enabled) {
        const initialized = initializeMetrika();
        if (initialized) {
          window.ym?.(YANDEX_METRIKA_ID, "hit", window.location.href, {
            title: document.title,
            referer: document.referrer,
          });
        }
        previousUrl.current = window.location.href;
      }
    }

    applyConsent(currentConsent());

    function onConsent(event: Event) {
      const consent = (event as CustomEvent<{ consent: AnalyticsConsent }>).detail?.consent;
      applyConsent(consent || null);
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
  }, []);

  useEffect(() => {
    if (currentConsent() === "necessary" || !window.ym) return;

    const nextUrl = window.location.href;
    const previous = previousUrl.current;
    if (previous && previous !== nextUrl) {
      window.ym(YANDEX_METRIKA_ID, "hit", nextUrl, {
        title: document.title,
        referer: previous,
      });
    }
    previousUrl.current = nextUrl;
  }, [pathname]);

  useEffect(() => {
    function trackContactClick(event: MouseEvent) {
      if (currentConsent() === "necessary" || !window.ym) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const goal = goalForLink(anchor);
      if (!goal) return;

      window.ym(YANDEX_METRIKA_ID, "reachGoal", goal, {
        contact: {
          placement: anchor.closest("header")
            ? "header"
            : anchor.closest("footer")
              ? "footer"
              : "content",
          page: window.location.pathname,
        },
      });
    }

    document.addEventListener("click", trackContactClick);
    return () => document.removeEventListener("click", trackContactClick);
  }, []);

  return null;
}
