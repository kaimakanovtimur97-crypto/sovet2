"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    ym?: (counterId: number, method: string, goal: string, params?: Record<string, unknown>) => void;
  }
}

export function LeadSuccessTracker() {
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem("sovet-lead-success");
      if (!raw) return;
      window.sessionStorage.removeItem("sovet-lead-success");

      const marker = JSON.parse(raw) as { leadId?: string; createdAt?: number };
      if (!marker.createdAt || Date.now() - marker.createdAt > 10 * 60 * 1000) return;

      const event = { event: "generate_lead", event_id: marker.leadId || "confirmed-lead" };
      window.dataLayer?.push(event);
      window.gtag?.("event", "generate_lead", { event_id: event.event_id });

      const metrikaId = Number(process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || 0);
      if (metrikaId > 0 && window.ym) {
        window.ym(metrikaId, "reachGoal", "lead_success", { event_id: event.event_id });
      }

      window.dispatchEvent(new CustomEvent("sovet:lead-success", { detail: event }));
    } catch {
      // A thank-you visit never exposes or reconstructs lead data.
    }
  }, []);

  return null;
}
