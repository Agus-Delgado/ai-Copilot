import { describe, it, expect } from "vitest";
import { generateArtifact } from "../src/lib/llm/generator";
import { MockProvider } from "../src/lib/llm/mockProvider";
import type { LLMProvider } from "../src/lib/llm/types";

// Mock provider that fails on first attempt
class FailFirstProvider implements LLMProvider {
  attempt: number = 0;
  successResponse: string;

  constructor(successResponse: string) {
    this.successResponse = successResponse;
  }

  async complete(): Promise<string> {
    this.attempt++;
    if (this.attempt === 1) {
      // First attempt: return invalid JSON
      return '{"invalid": json}';
    }
    // Second attempt: return valid JSON
    return this.successResponse;
  }
}

describe("Generator with Repair Loop", () => {
  it("generateArtifact succeeds with mock provider", async () => {
    const provider = new MockProvider();
    const brief = "Test brief for PRD";

    const result = await generateArtifact(provider, "PRD", brief);

    expect(result.artifact).toBeDefined();
    expect(result.artifact.artifactType).toBe("PRD");
    if (result.artifact.artifactType === "PRD") {
      expect(result.artifact.title).toBeDefined();
    }
    expect(result.raw).toBeDefined();
  });

  it("generateArtifact recovers from JSON parse error via repair loop", async () => {
    const validPRD = JSON.stringify({
      artifactType: "PRD",
      title: "Recovered PRD",
      problemStatement: "Problem",
      goals: ["Goal"],
      targetUsers: ["User"],
      scope: { inScope: ["Feature"], outOfScope: [] },
      functionalRequirements: [{ id: "FR-1", description: "Req", priority: "Must" }],
      successMetrics: ["Metric"],
    });

    const provider = new FailFirstProvider(validPRD);
    const brief = "Test brief";

    const result = await generateArtifact(provider, "PRD", brief);

    expect(result.artifact.artifactType).toBe("PRD");
    if (result.artifact.artifactType === "PRD") {
      expect(result.artifact.title).toBe("Recovered PRD");
    }
  });

  it("generateArtifact throws after exhausting retries", async () => {
    class AlwaysFailProvider implements LLMProvider {
      async complete(): Promise<string> {
        return "{ completely invalid }";
      }
    }

    const provider = new AlwaysFailProvider();
    const brief = "Test brief";

    await expect(generateArtifact(provider, "PRD", brief)).rejects.toThrow(
      /Failed to generate valid PRD after 2 repairs/
    );
  });

  it("generateArtifact generates different artifact types", async () => {
    const provider = new MockProvider();
    const brief = "Test brief";

    const prd = await generateArtifact(provider, "PRD", brief);
    expect(prd.artifact.artifactType).toBe("PRD");

    const backlog = await generateArtifact(provider, "Backlog", brief);
    expect(backlog.artifact.artifactType).toBe("Backlog");

    const risks = await generateArtifact(provider, "RiskRegister", brief);
    expect(risks.artifact.artifactType).toBe("RiskRegister");

    const qa = await generateArtifact(provider, "QAPack", brief);
    expect(qa.artifact.artifactType).toBe("QAPack");

    const critic = await generateArtifact(provider, "CriticReport", brief);
    expect(critic.artifact.artifactType).toBe("CriticReport");
  });
});
