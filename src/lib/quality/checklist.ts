import type { ArtifactType } from "../schemas/artifacts";

export type ChecklistItem = {
  key: string;
  label: string;
  ok: boolean;
  message: string;
};

function has(md: string, token: string) {
  return md.toLowerCase().includes(token.toLowerCase());
}

export function buildChecklist(type: ArtifactType, md: string): ChecklistItem[] {
  if (!md || typeof md !== "string") {
    return [{ key: "content", label: "Content available", ok: false, message: "No content" }];
  }
  switch (type) {
    case "PRD":
      return [
        { key: "goals", label: "Goals", ok: has(md, "## Goals"), message: has(md, "## Goals") ? "ok" : "missing" },
        { key: "scope", label: "Scope", ok: has(md, "## Scope") && has(md, "### In Scope"), message: has(md, "## Scope") ? "ok" : "missing" },
        { key: "assumptions", label: "Assumptions", ok: has(md, "## Assumptions"), message: has(md, "## Assumptions") ? "ok" : "missing" },
        { key: "metrics", label: "Success Metrics", ok: has(md, "## Success Metrics"), message: has(md, "## Success Metrics") ? "ok" : "missing" },
        { key: "risks", label: "Risks", ok: has(md, "## Risks"), message: has(md, "## Risks") ? "ok" : "missing" },
      ];
    case "Backlog":
      return [
        { key: "epic", label: "Epic", ok: has(md, "## Epic"), message: has(md, "## Epic") ? "ok" : "missing" },
        { key: "stories", label: "Stories", ok: has(md, "### Story"), message: has(md, "### Story") ? "ok" : "missing" },
        { key: "ac", label: "Acceptance Criteria", ok: has(md, "Acceptance Criteria"), message: has(md, "Acceptance Criteria") ? "ok" : "missing" },
      ];
    case "QAPack":
      return [
        { key: "testcases", label: "Test Cases", ok: has(md, "## Test Cases"), message: has(md, "## Test Cases") ? "ok" : "missing" },
        { key: "steps", label: "Steps", ok: has(md, "**Steps:**"), message: has(md, "**Steps:**") ? "ok" : "missing" },
        { key: "expected", label: "Expected Results", ok: has(md, "**Expected Results:**"), message: has(md, "**Expected Results:**") ? "ok" : "missing" },
        { key: "checklist", label: "Checklist", ok: has(md, "## Checklist"), message: has(md, "## Checklist") ? "ok" : "missing" },
      ];
    case "RiskRegister":
      return [
        { key: "risks", label: "Risks", ok: has(md, "## Risks"), message: has(md, "## Risks") ? "ok" : "missing" },
        { key: "mitigation", label: "Mitigation", ok: has(md, "Mitigation"), message: has(md, "Mitigation") ? "ok" : "missing" },
        { key: "likelihood", label: "Likelihood", ok: has(md, "Likelihood"), message: has(md, "Likelihood") ? "ok" : "missing" },
        { key: "impact", label: "Impact", ok: has(md, "Impact"), message: has(md, "Impact") ? "ok" : "missing" },
      ];
    case "CriticReport":
      return [
        { key: "summary", label: "Summary", ok: has(md, "## Summary"), message: has(md, "## Summary") ? "ok" : "missing" },
        { key: "missing", label: "Missing Information", ok: has(md, "## Missing Information"), message: has(md, "## Missing Information") ? "ok" : "missing" },
        { key: "ambiguities", label: "Ambiguities", ok: has(md, "## Ambiguities"), message: has(md, "## Ambiguities") ? "ok" : "missing" },
        { key: "inconsistencies", label: "Inconsistencies", ok: has(md, "## Inconsistencies"), message: has(md, "## Inconsistencies") ? "ok" : "missing" },
        { key: "next", label: "Recommended Next Steps", ok: has(md, "## Recommended Next Steps"), message: has(md, "## Recommended Next Steps") ? "ok" : "missing" },
      ];
    default:
      return [{ key: "content", label: "Content available", ok: true, message: "ok" }];
  }
}
