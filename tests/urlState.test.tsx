import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { App } from "../src/app/App";

const originalLocation = window.location.href;

const mockMatchMedia = () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe("URL state load/share", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", originalLocation);
    mockMatchMedia();
    Object.defineProperty(navigator, "clipboard", {
      writable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(window, "alert", {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.history.replaceState({}, "", originalLocation);
  });

  it("preloads artifactType, brief, tab, demo from URL and shares them", async () => {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?artifactType=Backlog&brief=hello+world&tab=markdown&demo=1`,
    );

    render(<App />);

    const select = screen.getByLabelText(/Artifact Type/i) as HTMLSelectElement;
    expect(select.value).toBe("Backlog");

    const textarea = screen.getByPlaceholderText(
      /Paste your unstructured requirements/i,
    ) as HTMLTextAreaElement;
    expect(textarea.value).toContain("hello world");

    // Demo mode indicator is now a badge in the header, not a checkbox.
    expect(screen.getByText(/Demo active/i)).toBeInTheDocument();
    // Alternatively, this is also stable:
    // expect(screen.getByRole("button", { name: /Exit demo mode/i })).toBeInTheDocument();

    const shareButton = screen.getByText(/Share link/i);
    fireEvent.click(shareButton);

    const clipboard = navigator.clipboard as unknown as {
      writeText: ReturnType<typeof vi.fn>;
    };

    await waitFor(() => {
      expect(clipboard.writeText).toHaveBeenCalled();
    });

    const copied = clipboard.writeText.mock.calls[0][0] as string;
    expect(copied).toContain("artifactType=Backlog");
    expect(copied).toContain("brief=hello+world");
    expect(copied).toContain("tab=markdown");
    expect(copied).toContain("demo=1");
  });
});
