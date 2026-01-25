import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

type Listener = (...args: unknown[]) => unknown;

type MatchMediaResult = {
  matches: boolean;
  media: string;
  onchange: Listener | null;
  addListener: Listener;
  removeListener: Listener;
  addEventListener: Listener;
  removeEventListener: Listener;
  dispatchEvent: Listener;
};

type MatchMediaFn = (query: string) => MatchMediaResult;

// Tipado “lite” del global sin usar DOM lib
const g = globalThis as unknown as { matchMedia?: MatchMediaFn };

if (typeof g.matchMedia !== "function") {
  Object.defineProperty(g, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string): MatchMediaResult => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
