import type { Artifact } from "../schemas/artifacts";

function escapePipes(s: string) {
  return s.replaceAll("|", "\\|");
}

export function toMarkdown(a: Artifact): string {
  switch (a.artifactType) {
    case "PRD":
      return `# ${a.title}

## Problem
${a.problemStatement}

## Goals
${a.goals.map(g => `- ${g}`).join("\n")}

## Non-Goals
${a.nonGoals.length ? a.nonGoals.map(g => `- ${g}`).join("\n") : "- (none)"}

## Target Users
${a.targetUsers.map(u => `- ${u}`).join("\n")}

## Scope

### In Scope
${a.scope.inScope.map(s => `- ${s}`).join("\n")}

### Out of Scope
${a.scope.outOfScope.length ? a.scope.outOfScope.map(s => `- ${s}`).join("\n") : "- (none)"}

## Functional Requirements
${a.functionalRequirements.map(fr => `- **${fr.id}** (${fr.priority}): ${fr.description}`).join("\n")}

## Non-Functional Requirements
${a.nonFunctionalRequirements.length
  ? a.nonFunctionalRequirements.map(n => `- **${n.id}** [${n.category}]: ${n.description}`).join("\n")
  : "- (none)"}

## Assumptions
${a.assumptions.length ? a.assumptions.map(a => `- ${a}`).join("\n") : "- (none)"}

## Dependencies
${a.dependencies.length ? a.dependencies.map(d => `- ${d}`).join("\n") : "- (none)"}

## Success Metrics
${a.successMetrics.map(m => `- ${m}`).join("\n")}

## Risks
${a.risks.length ? a.risks.map(r => `- **${r.id}**: ${r.description}\n  - Mitigation: ${r.mitigation}`).join("\n") : "- (none)"}
`;

    case "Backlog":
      return `# Backlog — ${a.productArea}

${a.epics.map(e => `## Epic: ${e.title} (${e.id})

${e.goal}

${e.stories.map(s => `### Story: ${s.id} — ${s.title}

**User Story:** ${s.userStory}

**Priority:** ${s.priority}${s.estimate ? `\n**Estimate:** ${s.estimate} points` : ""}

**Acceptance Criteria:**
${s.acceptanceCriteria.map(c => `- ${c}`).join("\n")}

${s.tags.length ? `**Tags:** ${s.tags.join(", ")}\n` : ""}
`).join("\n")}
`).join("\n")}
`;

    case "RiskRegister":
      return `# Risk Register

**Context:** ${a.context}

## Risks

| ID | Category | Likelihood | Impact | Status | Risk | Mitigation |
|---|---|---:|---:|---|---|---|
${a.risks.map(r => `| ${r.id} | ${r.category} | ${r.likelihood} | ${r.impact} | ${r.status} | ${escapePipes(r.risk)} | ${escapePipes(r.mitigation)} |`).join("\n")}
`;

    case "QAPack":
      return `# QA Pack — ${a.featureUnderTest}

## Test Cases

${a.testCases.map(tc => `### ${tc.id}: ${tc.title}

**Type:** ${tc.type}

${tc.preconditions.length ? `**Preconditions:**
${tc.preconditions.map(p => `- ${p}`).join("\n")}

` : ""}**Steps:**
${tc.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

**Expected Results:**
${tc.expectedResults.map(e => `- ${e}`).join("\n")}

${tc.testData.length ? `**Test Data:**
${tc.testData.map(td => `- ${td}`).join("\n")}` : ""}
`).join("\n")}

## Checklist

${a.checklist.map(c => `- [ ] ${c}`).join("\n")}
`;

    case "CriticReport":
      return `# Critic Report

## Summary
${a.summary}

## Missing Information (Questions to Clarify)
${a.missingInformationQuestions.map(q => `- ${q}`).join("\n")}

## Ambiguities
${a.ambiguities.length ? a.ambiguities.map(x => `- ${x}`).join("\n") : "- (none)"}

## Inconsistencies
${a.inconsistencies.length ? a.inconsistencies.map(x => `- ${x}`).join("\n") : "- (none)"}

## Risks / Concerns
${a.risksOrConcerns.length ? a.risksOrConcerns.map(x => `- ${x}`).join("\n") : "- (none)"}

## Recommended Next Steps
${a.recommendedNextSteps.length ? a.recommendedNextSteps.map(x => `- ${x}`).join("\n") : "- (none)"}
`;

    default:
      return "Unsupported artifact type";
  }
}

export function toJson(a: Artifact): string {
  return JSON.stringify(a, null, 2);
}
