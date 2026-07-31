/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Absolute origin of the API server for native (Capacitor) builds, e.g.
   * "https://hostinger-vps.tail9fd008.ts.net". Vite inlines this at build
   * time, so it must be set in the environment that runs `npm run build`.
   * Unset is correct for web builds, which are same-origin — see src/api.ts.
   */
  readonly VITE_API_BASE_URL?: string;
}
