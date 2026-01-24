export const SESSION_KEY = "ai_delivery_byok_api_key";
export const PERSISTED_KEY = "ai_delivery_byok_api_key_persisted";

function safeGet(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function safeSet(storage: Storage | undefined, key: string, value: string) {
  try {
    storage?.setItem(key, value);
  } catch {
    // Ignore storage write failures (e.g., private mode or blocked storage).
  }
}

function safeRemove(storage: Storage | undefined, key: string) {
  try {
    storage?.removeItem(key);
  } catch {
    // Ignore storage removal failures.
  }
}

export function clearStoredApiKey() {
  safeRemove(globalThis.sessionStorage, SESSION_KEY);
  safeRemove(globalThis.localStorage, PERSISTED_KEY);
}

export function persistApiKey(apiKey: string, remember: boolean) {
  const trimmed = apiKey.trim();
  if (!trimmed) {
    clearStoredApiKey();
    return;
  }

  safeSet(globalThis.sessionStorage, SESSION_KEY, trimmed);

  if (remember) {
    safeSet(globalThis.localStorage, PERSISTED_KEY, trimmed);
  } else {
    safeRemove(globalThis.localStorage, PERSISTED_KEY);
  }
}

export function readApiKeyState(): { apiKey: string; remembered: boolean } {
  const persisted = safeGet(globalThis.localStorage, PERSISTED_KEY);
  if (persisted) {
    return { apiKey: persisted, remembered: true };
  }

  const session = safeGet(globalThis.sessionStorage, SESSION_KEY);
  return { apiKey: session ?? "", remembered: false };
}

export function getStoredApiKey(): string {
  const persisted = safeGet(globalThis.localStorage, PERSISTED_KEY);
  if (persisted) return persisted;

  const session = safeGet(globalThis.sessionStorage, SESSION_KEY);
  return session ?? "";
}
