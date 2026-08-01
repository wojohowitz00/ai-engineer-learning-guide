import { Preferences } from "@capacitor/preferences";

/**
 * Progress persistence.
 *
 * Capacitor's Preferences plugin backs onto UserDefaults (iOS) and
 * SharedPreferences (Android) rather than webview localStorage, which mobile
 * OSs treat as transient and reclaim under disk pressure. On the web it falls
 * back to localStorage, so one code path is correct everywhere.
 *
 * Preferences is async; localStorage was not. Callers must therefore gate
 * their first render on the load resolving — see the `hydrated` flag in
 * App.tsx — or the UI paints default (zeroed) progress before correcting
 * itself.
 */
const STORAGE_KEY = "ai_engineer_roadmap_progress";

/**
 * Where progress lived before the move to Preferences.
 *
 * This matters more than it looks. The Preferences web backend stores under a
 * prefixed key (`CapacitorStorage.<key>`), so an existing user's blob at the
 * bare key is invisible to `Preferences.get()` — a naive swap would read as
 * "all my progress is gone" for every current web user. The plugin's own
 * `migrate()` does not help: it only rewrites Capacitor 2's `_cap_` prefix,
 * not arbitrary application keys. So adopt the legacy value explicitly.
 */
const LEGACY_LOCALSTORAGE_KEY = STORAGE_KEY;

function readLegacyValue(): string | null {
  try {
    return window.localStorage.getItem(LEGACY_LOCALSTORAGE_KEY);
  } catch (error) {
    // localStorage can throw outright in private/partitioned contexts. A
    // missing legacy value is not an error — it just means nothing to adopt.
    console.warn("Could not read legacy progress:", error);
    return null;
  }
}

/**
 * Read the stored progress blob, adopting any pre-Preferences value on first
 * run. Returns null when nothing has ever been saved.
 */
export async function loadStoredProgress(): Promise<string | null> {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  if (value !== null && value !== undefined) return value;

  const legacy = readLegacyValue();
  if (legacy === null) return null;

  // Adopt it, so subsequent loads take the fast path above. The legacy key is
  // deliberately left in place: if this write fails, or the user opens an
  // older build, their progress is still there. It costs a few hundred bytes.
  await Preferences.set({ key: STORAGE_KEY, value: legacy });
  return legacy;
}

/** Persist the progress blob. Rejects if the underlying store rejects. */
export async function saveStoredProgress(value: string): Promise<void> {
  await Preferences.set({ key: STORAGE_KEY, value });
}
