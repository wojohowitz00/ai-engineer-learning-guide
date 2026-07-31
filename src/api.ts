import { Capacitor } from "@capacitor/core";

// On the web the client is served by the same Express process that owns /api,
// so paths must stay relative — that keeps the app portable across whatever
// origin it is deployed to.
//
// A native Capacitor build has no such luxury: the document origin is
// capacitor://localhost (iOS) or http://localhost (Android), and there is no
// server behind it. Those requests need an absolute origin, baked in at build
// time via VITE_API_BASE_URL.
//
// The platform check happens at runtime, not build time, so a single
// `npm run build` produces assets that are correct for both targets — the web
// bundle simply ignores the baked-in value.
const CONFIGURED_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function resolveApiBaseUrl(): string {
  if (!Capacitor.isNativePlatform()) return "";

  if (!CONFIGURED_BASE_URL) {
    // Loud on purpose. Falling back to relative paths here would send every
    // request to capacitor://localhost, where the premium-teaser call fails
    // silently (App.tsx swallows it by design) and the app looks healthy while
    // every AI feature is dead. Better to say so once, up front.
    console.error(
      "[api] Running natively with no VITE_API_BASE_URL — every /api call will fail. " +
        "Rebuild with VITE_API_BASE_URL set to the API server's absolute origin."
    );
    return "";
  }

  // Tolerate a trailing slash so "https://host/" and "https://host" behave the
  // same; every caller supplies a leading-slash path.
  return CONFIGURED_BASE_URL.replace(/\/+$/, "");
}

const API_BASE_URL = resolveApiBaseUrl();

/**
 * Resolve an API path against the correct origin for the current platform.
 * Pass the same leading-slash path used on the web, e.g. apiUrl("/api/ai/health").
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}
