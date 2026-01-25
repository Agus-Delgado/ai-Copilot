/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { buildPrompt, buildRepairPrompt } from "../src/lib/prompts";

describe("prompts and guardrails", () => {
  describe("buildPrompt", () => {
    it("includes artifact type in prompt", () => {
      const prompt = buildPrompt("PRD", "test brief");
      expect(prompt).toContain("PRD");
      expect(prompt).toContain("test brief");
    });

    it("includes JSON output instruction", () => {
      const prompt = buildPrompt("PRD", "brief");
      expect(prompt.toLowerCase()).toContain("json");
    });

    it("includes type-specific guardrails for PRD", () => {
      const prompt = buildPrompt("PRD", "brief");
      expect(prompt).toContain("title");
      expect(prompt).toContain("problemStatement");
      expect(prompt).toContain("functionalRequirements");
    });

    it("includes type-specific guardrails for Backlog", () => {
      const prompt = buildPrompt("Backlog", "brief");
      expect(prompt).toContain("productArea");
      expect(prompt).toContain("epics");
      expect(prompt).toContain("stories");
    });

    it("includes type-specific guardrails for RiskRegister", () => {
      const prompt = buildPrompt("RiskRegister", "brief");
      expect(prompt).toContain("context");
      expect(prompt).toContain("risks");
      expect(prompt).toContain("likelihood");
    });

    it("includes type-specific guardrails for QAPack", () => {
      const prompt = buildPrompt("QAPack", "brief");
      expect(prompt).toContain("featureUnderTest");
      expect(prompt).toContain("testCases");
      expect(prompt).toContain("checklist");
    });

    it("includes type-specific guardrails for CriticReport", () => {
      const prompt = buildPrompt("CriticReport", "brief");
      expect(prompt).toContain("summary");
      expect(prompt).toContain("ambiguities");
      expect(prompt).toContain("inconsistencies");
    });

    it("does not include API credentials", () => {
      const prompt = buildPrompt("PRD", "brief");
      expect(prompt).not.toContain("api_key");
      expect(prompt).not.toContain("apiKey");
      expect(prompt).not.toContain("secret");
      expect(prompt).not.toContain("bearer");
      expect(prompt).not.toContain("token=");
    });
  });

  describe("buildRepairPrompt", () => {
    it("includes artifact type", () => {
      const prompt = buildRepairPrompt("PRD", '{"invalid": "json"}', "error");
      expect(prompt).toContain("PRD");
    });

    it("includes raw output", () => {
      const raw = '{"test": "data"}';
      const prompt = buildRepairPrompt("PRD", raw, "error");
      expect(prompt).toContain(raw);
    });

    it("includes error details", () => {
      const error = "missing required field: title";
      const prompt = buildRepairPrompt("PRD", "{}", error);
      expect(prompt).toContain(error);
    });

    it("does not include API credentials", () => {
      const prompt = buildRepairPrompt("PRD", "{}", "error");
      expect(prompt).not.toContain("api_key");
      expect(prompt).not.toContain("apiKey");
      expect(prompt).not.toContain("secret");
      expect(prompt).not.toContain("bearer");
    });
  });
});
