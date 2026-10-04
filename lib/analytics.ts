/**
 * Analytics abstraction for JP CARS.
 * Replace the console.log calls with your preferred analytics SDK.
 * No tracking IDs are stored here.
 */

type AnalyticsEvent =
  | "vehicle_view"
  | "search"
  | "filter_used"
  | "whatsapp_click"
  | "call_click"
  | "directions_click"
  | "test_drive_submit"
  | "sell_car_submit"
  | "finance_submit"
  | "wishlist_add"
  | "compare_add"
  | "instagram_click";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

export function track(event: AnalyticsEvent, properties?: EventProperties) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
  }

  // Plug in your analytics provider here:
  // gtag('event', event, properties);
  // posthog.capture(event, properties);
  // mixpanel.track(event, properties);
}
