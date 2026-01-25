import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const w = globalThis as any;
if (!w.matchMedia) {
  Object.defineProperty(w, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
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
