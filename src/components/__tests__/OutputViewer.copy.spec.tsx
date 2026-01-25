import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { OutputViewer } from "../../components/OutputViewer";
import type { Artifact } from "../../lib/schemas/artifacts";

const backlogArtifact = {
  artifactType: "Backlog",
  productArea: "Test Area",
  epics: [
    {
      id: "E1",
      title: "Epic A",
      goal: "Ship feature X",
      stories: [
        {
          id: "S1",
          title: "Story A",
          userStory: "As a user I want X so that Y",
          acceptanceCriteria: ["Given A, when B, then C"],
          priority: "P1",
          relatedRequirementIds: [],
          tags: [],
        },
      ],
    },
  ],
} as unknown as Artifact;

describe("OutputViewer copy actions", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    // Mock clipboard de forma segura (readonly en JSDOM)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });
  });

  it("renders copy buttons", () => {
    render(
      <OutputViewer
        artifact={backlogArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={() => {}}
      />
    );

    // Si los labels difieren, ajustá estos strings a lo que renderiza tu UI
    expect(screen.getByText("Copy to Clipboard")).toBeInTheDocument();
    expect(screen.getByText("Copy for Jira")).toBeInTheDocument();
    expect(screen.getByText("Copy for GitHub Issues")).toBeInTheDocument();
  });

  it("copies Jira text", async () => {
    render(
      <OutputViewer
        artifact={backlogArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Copy for Jira"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    const arg = (navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(typeof arg).toBe("string");
    expect(arg.length).toBeGreaterThan(0);
  });

  it("copies GitHub Issues text", async () => {
    render(
      <OutputViewer
        artifact={backlogArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={() => {}}
      />
    );

    fireEvent.click(screen.getByText("Copy for GitHub Issues"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    const arg = (navigator.clipboard.writeText as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(typeof arg).toBe("string");
    expect(arg.length).toBeGreaterThan(0);
  });
});
