import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutputViewer } from "../../components/OutputViewer";
import type { Artifact } from "../../lib/schemas/artifacts";

const backlogArtifact = {
  artifactType: "Backlog",
  productArea: "Area",
  epics: [
    {
      id: "E1",
      title: "Epic 1",
      goal: "Goal",
      stories: [
        {
          id: "S1",
          title: "Story 1",
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

describe("Quality Checklist panel", () => {
  it("renders checklist heading", () => {
    render(
      <OutputViewer
        artifact={backlogArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={() => {}}
      />
    );

    expect(screen.getByText("Quality Checklist")).toBeInTheDocument();
  });

  it("shows Acceptance Criteria item", () => {
    render(
      <OutputViewer
        artifact={backlogArtifact}
        error={null}
        loading={false}
        tab="markdown"
        onTabChange={() => {}}
      />
    );

    expect(screen.getByText("Acceptance Criteria")).toBeInTheDocument();
  });
});
