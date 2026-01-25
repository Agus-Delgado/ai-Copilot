/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import { ArtifactSchema, PRDSchema, BacklogSchema, RiskRegisterSchema, QAPackSchema, CriticReportSchema } from "../src/lib/schemas/artifacts";

describe("Schema Validation", () => {
  it("PRDSchema validates valid PRD", () => {
    const validPRD = {
      artifactType: "PRD",
      title: "Test PRD",
      problemStatement: "Test problem",
      goals: ["Goal 1"],
      targetUsers: ["User 1"],
      scope: {
        inScope: ["Feature 1"],
        outOfScope: [],
      },
      functionalRequirements: [
        { id: "FR-1", description: "Requirement 1", priority: "Must" },
      ],
      nonFunctionalRequirements: [],
      assumptions: [],
      dependencies: [],
      successMetrics: ["Metric 1"],
      risks: [],
    };

    const result = PRDSchema.safeParse(validPRD);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.artifactType).toBe("PRD");
    }
  });

  it("BacklogSchema validates valid Backlog", () => {
    const validBacklog = {
      artifactType: "Backlog",
      productArea: "Test Area",
      epics: [
        {
          id: "E-1",
          title: "Epic 1",
          goal: "Goal 1",
          stories: [
            {
              id: "S-1",
              title: "Story 1",
              userStory: "As a user, I want X so that Y",
              acceptanceCriteria: ["Criteria 1"],
              priority: "P0",
              relatedRequirementIds: [],
              tags: [],
            },
          ],
        },
      ],
    };

    const result = BacklogSchema.safeParse(validBacklog);
    expect(result.success).toBe(true);
  });

  it("RiskRegisterSchema validates valid RiskRegister", () => {
    const validRiskRegister = {
      artifactType: "RiskRegister",
      context: "Test context",
      risks: [
        {
          id: "R-1",
          category: "Security",
          risk: "Test risk",
          likelihood: 3,
          impact: 4,
          mitigation: "Test mitigation",
          owner: "Owner",
          status: "Open",
        },
      ],
    };

    const result = RiskRegisterSchema.safeParse(validRiskRegister);
    expect(result.success).toBe(true);
  });

  it("QAPackSchema validates valid QAPack", () => {
    const validQAPack = {
      artifactType: "QAPack",
      featureUnderTest: "Feature X",
      testCases: [
        {
          id: "TC-1",
          title: "Test case 1",
          type: "HappyPath",
          preconditions: [],
          steps: ["Step 1"],
          expectedResults: ["Result 1"],
          testData: [],
        },
      ],
      checklist: ["Item 1"],
    };

    const result = QAPackSchema.safeParse(validQAPack);
    expect(result.success).toBe(true);
  });

  it("CriticReportSchema validates valid CriticReport", () => {
    const validCriticReport = {
      artifactType: "CriticReport",
      summary: "Test summary",
      ambiguities: [],
      inconsistencies: [],
      missingInformationQuestions: ["Question 1"],
      risksOrConcerns: [],
      recommendedNextSteps: [],
    };

    const result = CriticReportSchema.safeParse(validCriticReport);
    expect(result.success).toBe(true);
  });

  it("ArtifactSchema discriminates correctly", () => {
    const prd = {
      artifactType: "PRD",
      title: "Test",
      problemStatement: "Test",
      goals: ["Goal 1"],
      targetUsers: ["User 1"],
      scope: { inScope: ["Feature 1"], outOfScope: [] },
      functionalRequirements: [{ id: "FR-1", description: "Req", priority: "Must" }],
      successMetrics: ["Metric 1"],
    };

    const result = ArtifactSchema.safeParse(prd);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.artifactType).toBe("PRD");
    }
  });

  it("Schema rejects invalid data", () => {
    const invalidPRD = {
      artifactType: "PRD",
      title: "Test",
      // Missing required fields
    };

    const result = PRDSchema.safeParse(invalidPRD);
    expect(result.success).toBe(false);
  });
});
