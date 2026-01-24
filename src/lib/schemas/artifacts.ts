import { z } from "zod";

export const ArtifactTypeEnum = z.enum([
  "PRD",
  "Backlog",
  "RiskRegister",
  "QAPack",
  "CriticReport",
]);
export type ArtifactType = z.infer<typeof ArtifactTypeEnum>;

const Id = z.string().min(1);
const NonEmpty = z.string().min(1);

export const PRDSchema = z.object({
  artifactType: z.literal("PRD"),
  title: NonEmpty,
  problemStatement: NonEmpty,
  goals: z.array(NonEmpty).min(1),
  nonGoals: z.array(NonEmpty).default([]),
  targetUsers: z.array(NonEmpty).min(1),

  scope: z.object({
    inScope: z.array(NonEmpty).min(1),
    outOfScope: z.array(NonEmpty).default([]),
  }),

  functionalRequirements: z
    .array(
      z.object({
        id: Id,
        description: NonEmpty,
        priority: z.enum(["Must", "Should", "Could"]).default("Must"),
      })
    )
    .min(1),

  nonFunctionalRequirements: z
    .array(
      z.object({
        id: Id,
        category: z.enum(["Performance", "Security", "Reliability", "Privacy", "Compliance", "UX", "Other"]),
        description: NonEmpty,
      })
    )
    .default([]),

  assumptions: z.array(NonEmpty).default([]),
  dependencies: z.array(NonEmpty).default([]),
  successMetrics: z.array(NonEmpty).min(1),
  risks: z
    .array(
      z.object({
        id: Id,
        description: NonEmpty,
        mitigation: NonEmpty,
      })
    )
    .default([]),
});

export const BacklogSchema = z.object({
  artifactType: z.literal("Backlog"),
  productArea: NonEmpty,
  epics: z
    .array(
      z.object({
        id: Id,
        title: NonEmpty,
        goal: NonEmpty,
        stories: z
          .array(
            z.object({
              id: Id,
              title: NonEmpty,
              userStory: NonEmpty,
              acceptanceCriteria: z.array(NonEmpty).min(1),
              priority: z.enum(["P0", "P1", "P2"]).default("P1"),
              estimate: z.number().int().positive().optional(),
              relatedRequirementIds: z.array(Id).default([]),
              tags: z.array(NonEmpty).default([]),
            })
          )
          .min(1),
      })
    )
    .min(1),
});

export const RiskRegisterSchema = z.object({
  artifactType: z.literal("RiskRegister"),
  context: NonEmpty,
  risks: z
    .array(
      z.object({
        id: Id,
        category: z.enum(["Security", "Privacy", "Compliance", "Operational", "Product", "Technical", "Other"]),
        risk: NonEmpty,
        likelihood: z.number().int().min(1).max(5),
        impact: z.number().int().min(1).max(5),
        mitigation: NonEmpty,
        owner: z.string().optional(),
        status: z.enum(["Open", "Mitigating", "Closed"]).default("Open"),
      })
    )
    .min(1),
});

export const QAPackSchema = z.object({
  artifactType: z.literal("QAPack"),
  featureUnderTest: NonEmpty,
  testCases: z
    .array(
      z.object({
        id: Id,
        title: NonEmpty,
        type: z.enum(["HappyPath", "EdgeCase", "Regression", "Security", "Performance"]).default("HappyPath"),
        preconditions: z.array(NonEmpty).default([]),
        steps: z.array(NonEmpty).min(1),
        expectedResults: z.array(NonEmpty).min(1),
        testData: z.array(NonEmpty).default([]),
      })
    )
    .min(1),
  checklist: z.array(NonEmpty).min(1),
});

export const CriticReportSchema = z.object({
  artifactType: z.literal("CriticReport"),
  summary: NonEmpty,
  ambiguities: z.array(NonEmpty).default([]),
  inconsistencies: z.array(NonEmpty).default([]),
  missingInformationQuestions: z.array(NonEmpty).min(1),
  risksOrConcerns: z.array(NonEmpty).default([]),
  recommendedNextSteps: z.array(NonEmpty).default([]),
});

export const ArtifactSchema = z.discriminatedUnion("artifactType", [
  PRDSchema,
  BacklogSchema,
  RiskRegisterSchema,
  QAPackSchema,
  CriticReportSchema,
]);

export type Artifact = z.infer<typeof ArtifactSchema>;
