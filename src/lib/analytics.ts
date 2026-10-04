// Sends conversion events to every analytics tool that is configured (GA4/GTM dataLayer, Yandex Metrika).
type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    ym?: (id: number, action: string, goal: string, params?: Params) => void;
  }
}

const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID) || 0;

export function trackEvent(name: string, params: Params = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
    window.dataLayer?.push({ event: name, ...params });
    if (YM_ID) window.ym?.(YM_ID, "reachGoal", name, params);
  } catch {
    // analytics must never break the page
  }
}

/** Page view for client-side navigations (the first view is sent by the Metrika init itself). */
export function trackPageView(url: string): void {
  if (typeof window === "undefined" || !YM_ID) return;
  try {
    window.ym?.(YM_ID, "hit", url);
  } catch {
    // ignore
  }
}
