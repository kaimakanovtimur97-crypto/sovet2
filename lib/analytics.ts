export const YANDEX_METRIKA_ID = 111627787;

export const ANALYTICS_CONSENT_STORAGE_KEY = "sovet-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "sovet:analytics-consent";
export const OPEN_COOKIE_SETTINGS_EVENT = "sovet:open-cookie-settings";

export type AnalyticsConsent = "analytics" | "necessary";

export const metrikaGoals = {
  phone: "contact_phone",
  telegram: "contact_telegram",
  whatsapp: "contact_whatsapp",
  max: "contact_max",
} as const;
