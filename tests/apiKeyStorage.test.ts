import { beforeEach, describe, expect, it } from "vitest";
import {
  PERSISTED_KEY,
  SESSION_KEY,
  clearStoredApiKey,
  getStoredApiKey,
  persistApiKey,
  readApiKeyState,
} from "../src/lib/llm/apiKeyStorage";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("BYOK API key storage", () => {
  it("prefers persisted key over session key", () => {
    sessionStorage.setItem(SESSION_KEY, "session-value");
    localStorage.setItem(PERSISTED_KEY, "persisted-value");

    expect(getStoredApiKey()).toBe("persisted-value");
  });

  it("stores in session by default and optionally in localStorage", () => {
    persistApiKey("secret-key", true);
    expect(sessionStorage.getItem(SESSION_KEY)).toBe("secret-key");
    expect(localStorage.getItem(PERSISTED_KEY)).toBe("secret-key");

    persistApiKey("rotated-key", false);
    expect(sessionStorage.getItem(SESSION_KEY)).toBe("rotated-key");
    expect(localStorage.getItem(PERSISTED_KEY)).toBeNull();
  });

  it("clears keys when value is empty or reset", () => {
    persistApiKey("secret", true);
    persistApiKey("", true);

    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
    expect(localStorage.getItem(PERSISTED_KEY)).toBeNull();

    sessionStorage.setItem(SESSION_KEY, "temp");
    clearStoredApiKey();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it("exposes remember flag based on storage source", () => {
    sessionStorage.setItem(SESSION_KEY, "session-only");
    let state = readApiKeyState();
    expect(state.apiKey).toBe("session-only");
    expect(state.remembered).toBe(false);

    localStorage.setItem(PERSISTED_KEY, "persisted-only");
    state = readApiKeyState();
    expect(state.apiKey).toBe("persisted-only");
    expect(state.remembered).toBe(true);
  });
});
