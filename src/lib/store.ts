import { create } from "zustand";
import type { Artifact, ArtifactType } from "./schemas/artifacts";

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
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
  persistOutputs: boolean;
  setPersistOutputs: (value: boolean) => void;
  history: HistoryEntry[];
  addHistoryEntry: (entry: HistoryEntryInput) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = "providerConfig";
const DEMO_MODE_KEY = "demoModeEnabled";
const PERSIST_OUTPUTS_KEY = "persistOutputsEnabled";
const HISTORY_KEY = "generationHistory";

const MAX_HISTORY_ITEMS = 20;
const MAX_HISTORY_BYTES = 200_000; // ~200 KB cap to avoid quota issues

const defaultConfig: ProviderConfig = {
  type: "mock",
  byokBaseUrl: "https://api.deepseek.com/v1",
  byokModel: "deepseek-chat",
};

export type HistoryEntry = {
  id: string;
  createdAt: number;
  artifactType: ArtifactType;
  brief: string;
  providerType: ProviderType;
  demoMode: boolean;
  artifact: Artifact | null;
  raw: string | null;
};

export type HistoryEntryInput = Omit<HistoryEntry, "id" | "createdAt"> & {
  id?: string;
  createdAt?: number;
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

function loadDemoMode(): boolean {
  try {
    const saved = localStorage.getItem(DEMO_MODE_KEY);
    if (saved === null) return false;
    return saved === "true";
  } catch {
    return false;
  }
}

function persistDemoMode(value: boolean) {
  try {
    localStorage.setItem(DEMO_MODE_KEY, value ? "true" : "false");
  } catch {
    // Ignore persistence errors.
  }
}

function loadPersistOutputs(): boolean {
  try {
    const saved = localStorage.getItem(PERSIST_OUTPUTS_KEY);
    if (saved === null) return true;
    return saved === "true";
  } catch {
    return true;
  }
}

function persistPersistOutputs(value: boolean) {
  try {
    localStorage.setItem(PERSIST_OUTPUTS_KEY, value ? "true" : "false");
  } catch {
    // Ignore persistence errors.
  }
}

function safeParseHistory(): HistoryEntry[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => sanitizeHistoryEntry(entry))
      .filter((entry): entry is HistoryEntry => Boolean(entry));
  } catch {
    return [];
  }
}

function persistHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Ignore persistence errors.
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `hist-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sanitizeHistoryEntry(entry: unknown): HistoryEntry | null {
  if (!entry || typeof entry !== "object") return null;
  const value = entry as Record<string, unknown>;
  const artifactType = typeof value.artifactType === "string" ? (value.artifactType as ArtifactType) : null;
  const brief = typeof value.brief === "string" ? value.brief : "";
  const providerType = value.providerType === "byok" ? "byok" : "mock";
  const demoMode = value.demoMode === true;
  const id = typeof value.id === "string" ? value.id : generateId();
  const createdAt = typeof value.createdAt === "number" ? value.createdAt : Date.now();
  const artifact = (value.artifact as Artifact | null) ?? null;
  const raw = typeof value.raw === "string" ? value.raw : null;

  if (!artifactType) return null;

  return { id, createdAt, artifactType, brief, providerType, demoMode, artifact, raw };
}

function trimHistory(entries: HistoryEntry[]): HistoryEntry[] {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);
  let trimmed = sorted.slice(0, MAX_HISTORY_ITEMS);

  const encoder = new TextEncoder();
  while (encoder.encode(JSON.stringify(trimmed)).byteLength > MAX_HISTORY_BYTES && trimmed.length > 1) {
    trimmed = trimmed.slice(0, trimmed.length - 1);
  }

  return trimmed;
}

export const useStore = create<Store>((set) => ({
  providerConfig: loadConfig(),
  demoMode: loadDemoMode(),
  persistOutputs: loadPersistOutputs(),
  history: safeParseHistory(),

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

    persistDemoMode(false);
    set({ demoMode: false });
  },

  setDemoMode: (value: boolean) => {
    set(() => {
      persistDemoMode(value);
      return { demoMode: value };
    });
  },

  setPersistOutputs: (value: boolean) => {
    set(() => {
      persistPersistOutputs(value);
      return { persistOutputs: value };
    });
  },

  addHistoryEntry: (entry: HistoryEntryInput) => {
    set((state) => {
        const id = entry.id ?? generateId();
      const createdAt = entry.createdAt ?? Date.now();
      const baseEntry: HistoryEntry = {
        id,
        createdAt,
        artifactType: entry.artifactType,
        brief: entry.brief,
        providerType: entry.providerType,
        demoMode: entry.demoMode,
        artifact: state.persistOutputs ? entry.artifact : null,
        raw: state.persistOutputs ? entry.raw : null,
      };

      const next = trimHistory([baseEntry, ...state.history]);
      persistHistory(next);
      return { history: next };
    });
  },

  deleteHistoryEntry: (id: string) => {
    set((state) => {
      const next = state.history.filter((item) => item.id !== id);
      persistHistory(next);
      return { history: next };
    });
  },

  clearHistory: () => {
    set(() => {
      persistHistory([]);
      return { history: [] };
    });
  },
}));
