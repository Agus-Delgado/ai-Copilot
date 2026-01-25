/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { BRIEF_TEMPLATES } from "../src/app/briefTemplates";

describe("Brief Templates", () => {
  it("should have templates for all required artifact types", () => {
    const types = BRIEF_TEMPLATES.map((t) => t.artifactType);
    expect(types).toContain("PRD");
    expect(types).toContain("Backlog");
    expect(types).toContain("QAPack");
    expect(types).toContain("RiskRegister");
    expect(types).toContain("CriticReport");
  });

  it("should have at least one template per type", () => {
    const prds = BRIEF_TEMPLATES.filter((t) => t.artifactType === "PRD");
    const backlogs = BRIEF_TEMPLATES.filter((t) => t.artifactType === "Backlog");
    const qaPacks = BRIEF_TEMPLATES.filter((t) => t.artifactType === "QAPack");
    const risks = BRIEF_TEMPLATES.filter((t) => t.artifactType === "RiskRegister");
    const critics = BRIEF_TEMPLATES.filter((t) => t.artifactType === "CriticReport");

    expect(prds.length).toBeGreaterThan(0);
    expect(backlogs.length).toBeGreaterThan(0);
    expect(qaPacks.length).toBeGreaterThan(0);
    expect(risks.length).toBeGreaterThan(0);
    expect(critics.length).toBeGreaterThan(0);
  });

  it("should have title and content for each template", () => {
    BRIEF_TEMPLATES.forEach((template) => {
      expect(template.title).toBeTruthy();
      expect(template.content).toBeTruthy();
      expect(template.content.length).toBeGreaterThan(10);
    });
  });
});
