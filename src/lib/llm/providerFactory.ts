import type { ProviderConfig } from "../store";
import { getStoredApiKey } from "./apiKeyStorage";
import { ByokProvider } from "./byokProvider";
import { MockProvider } from "./mockProvider";
import type { LLMProvider } from "./types";

export function createProvider(config: ProviderConfig): LLMProvider {
  if (config.type === "mock") {
    return new MockProvider();
  }

  const apiKey = getStoredApiKey();
  if (!apiKey.trim()) {
    throw new Error("Missing API key. Configure BYOK provider.");
  }

  return new ByokProvider({
    baseUrl: config.byokBaseUrl,
    apiKey: apiKey.trim(),
    model: config.byokModel,
  });
}
