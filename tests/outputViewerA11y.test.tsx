import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutputViewer } from "../src/components/OutputViewer";
import type { Artifact } from "../src/lib/schemas/artifacts";

describe("OutputViewer a11y – tab keyboard navigation", () => {
  const mockArtifact = {
    type: "PRD",
    artifactType: "PRD",
    title: "Test PRD",
    problemStatement: "Test problem",
    goals: ["Goal 1"],
    nonGoals: ["Non-goal 1"],
    targetUsers: ["User 1"],
    scope: { inScope: ["Scope 1"], outOfScope: ["Out 1"] },
    functionalRequirements: [{ id: "req-1", title: "Req 1", description: "Desc 1", priority: "Must" }],
    nonFunctionalRequirements: [],
    constraints: [],
    assumptions: [],
    dependencies: [],
    successCriteria: ["Criteria 1"],
    successMetrics: ["Metric 1"],
    timeline: { phases: [{ name: "Phase 1", duration: "1 week" }] },
    risks: [],
  } as unknown as Artifact;

  it("should render tab buttons with proper semantics", () => {
    render(
      <OutputViewer
        artifact={mockArtifact}
        error={null}
        loading={false}
        tab="json"
        onTabChange={() => {}}
      />
    );

    const jsonTab = screen.getByRole("tab", { name: /json/i });
    const mdTab = screen.getByRole("tab", { name: /markdown/i });

    expect(jsonTab.getAttribute("aria-selected")).toBe("true");
    expect(mdTab.getAttribute("aria-selected")).toBe("false");
  });

  it("should navigate tabs with arrow keys", async () => {
    const onTabChange = vi.fn();

    const { rerender } = render(
      <OutputViewer
        artifact={mockArtifact}
        error={null}
        loading={false}
        tab="json"
        onTabChange={onTabChange}
      />
    );

    const jsonTab = screen.getByRole("tab", { name: /json/i });

    // Simulate ArrowRight on JSON tab
    jsonTab.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(onTabChange).toHaveBeenCalledWith("markdown");

    // Reset and test ArrowLeft from Markdown
    onTabChange.mockClear();
    rerender(
      <OutputViewer
        artifact={mockArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={onTabChange}
      />
    );

    const mdTab = screen.getByRole("tab", { name: /markdown/i });
    mdTab.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(onTabChange).toHaveBeenCalledWith("json");
  });

  it("should have aria-controls and aria-labelledby on panels", () => {
    render(
      <OutputViewer
        artifact={mockArtifact}
        error={null}
        loading={false}
        tab="json"
        onTabChange={() => {}}
      />
    );

    const jsonTab = screen.getByRole("tab", { name: /json/i });
    const jsonPanel = screen.getByRole("tabpanel");

    expect(jsonTab.getAttribute("aria-controls")).toBe("ov-panel-json");
    expect(jsonPanel?.getAttribute("aria-labelledby")).toBe("ov-tab-json");
  });
});
