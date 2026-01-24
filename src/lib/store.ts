import { create } from "zustand";

export type ProviderType = "mock" | "byok";

export type ProviderConfig = {
  type: ProviderType;
  byokBaseUrl: string;
  byokModel: string;
};

interface Store {
  providerConfig: ProviderConfig;
  setProviderConfig: (config: Partial<ProviderConfig>) => void;
  resetProviderConfig: () => void;
}

const STORAGE_KEY = "providerConfig";

const defaultConfig: ProviderConfig = {
  type: "mock",
  byokBaseUrl: "https://api.deepseek.com/v1",
  byokModel: "deepseek-chat",
};

function sanitizeConfig(config: Partial<ProviderConfig> | null | undefined): ProviderConfig {
  const base = config ?? {};
  const type: ProviderType = base.type === "byok" ? "byok" : "mock";

  return {
    type,
    byokBaseUrl: typeof base.byokBaseUrl === "string" ? base.byokBaseUrl : defaultConfig.byokBaseUrl,
    byokModel: typeof base.byokModel === "string" ? base.byokModel : defaultConfig.byokModel,
  };
}

function loadConfig(): ProviderConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultConfig;
    const parsed = JSON.parse(saved);

    // Migration: drop any legacy apiKey fields and keep only non-secret fields.
    return sanitizeConfig(parsed);
  } catch {
    return defaultConfig;
  }
}

function persistConfig(config: ProviderConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore persistence errors to avoid breaking the app in restricted environments.
  }
}

export const useStore = create<Store>((set) => ({
  providerConfig: loadConfig(),

  setProviderConfig: (config: Partial<ProviderConfig>) => {
    set((state) => {
      const updated = sanitizeConfig({ ...state.providerConfig, ...config });
      persistConfig(updated);
      return { providerConfig: updated };
    });
  },

  resetProviderConfig: () => {
    set({ providerConfig: defaultConfig });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage removal issues.
    }
  },
}));
