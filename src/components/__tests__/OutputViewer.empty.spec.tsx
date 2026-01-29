import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OutputViewer } from "../OutputViewer";

describe("OutputViewer empty state", () => {
  it("renders guidance message when no artifact", () => {
    const onTryDemo = vi.fn();

    render(
      <OutputViewer
        artifact={null}
        error={null}
        loading={false}
        tab="json"
        onTabChange={() => {}}
        onTryDemo={onTryDemo}
      />,
    );

    // Core empty-state content
    expect(screen.getByText(/No artifact generated yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Get started by generating your first artifact/i),
    ).toBeInTheDocument();

    // The guidance list exists and includes key actions (text may be split across elements)
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThanOrEqual(3);

    // Check key phrases in the list items (split-safe)
    expect(screen.getByText(/quick start/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/custom brief/i)).toBeInTheDocument();

    // CTA exists and is actionable when handler is provided
    const cta = screen.getByRole("button", { name: /Try Demo Now/i });
    fireEvent.click(cta);
    expect(onTryDemo).toHaveBeenCalledTimes(1);
  });
});
