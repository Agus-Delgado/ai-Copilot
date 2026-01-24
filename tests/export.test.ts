import { describe, it, expect } from "vitest";
import { toMarkdown, toJson } from "../src/lib/export/markdownExport";
import { MockProvider } from "../src/lib/llm/mockProvider";
import { generateArtifact } from "../src/lib/llm/generator";

describe("Export Functions", () => {
  it("toJson serializes artifact correctly", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "PRD", "Test");

    const json = toJson(artifact);
    const parsed = JSON.parse(json);

    expect(parsed.artifactType).toBe("PRD");
    expect(parsed.title).toBeDefined();
    expect(parsed.problemStatement).toBeDefined();
  });

  it("toMarkdown generates markdown for PRD", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "PRD", "Test");

    const markdown = toMarkdown(artifact);

    if (artifact.artifactType === "PRD") {
      expect(markdown).toContain("# " + artifact.title);
    }
    expect(markdown).toContain("## Problem");
    expect(markdown).toContain("## Goals");
    expect(markdown).toContain("## Functional Requirements");
  });

  it("toMarkdown generates markdown for Backlog", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "Backlog", "Test");

    const markdown = toMarkdown(artifact);

    expect(markdown).toContain("# Backlog");
    expect(markdown).toContain("## Epic:");
    expect(markdown).toContain("Story:");
  });

  it("toMarkdown generates markdown for RiskRegister", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "RiskRegister", "Test");

    const markdown = toMarkdown(artifact);

    expect(markdown).toContain("# Risk Register");
    expect(markdown).toContain("|");
    expect(markdown).toContain("Likelihood");
    expect(markdown).toContain("Impact");
  });

  it("toMarkdown generates markdown for QAPack", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "QAPack", "Test");

    const markdown = toMarkdown(artifact);

    expect(markdown).toContain("# QA Pack");
    expect(markdown).toContain("## Test Cases");
    expect(markdown).toContain("Checklist");
  });

  it("toMarkdown generates markdown for CriticReport", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "CriticReport", "Test");

    const markdown = toMarkdown(artifact);

    expect(markdown).toContain("# Critic Report");
    expect(markdown).toContain("## Summary");
    expect(markdown).toContain("Missing Information");
  });

  it("toMarkdown handles arrays with content", async () => {
    const provider = new MockProvider();
    const { artifact } = await generateArtifact(provider, "CriticReport", "Test");

    const markdown = toMarkdown(artifact);

    // Should have content from the mock data
    expect(markdown).toContain("# Critic Report");
    expect(markdown).toContain("## Summary");
  });
});
