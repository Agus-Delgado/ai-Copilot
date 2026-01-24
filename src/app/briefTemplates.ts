import type { ArtifactType } from "../lib/schemas/artifacts";

export type BriefTemplate = {
  title: string;
  content: string;
  artifactType: ArtifactType;
};

export const BRIEF_TEMPLATES: BriefTemplate[] = [
  {
    title: "PRD - SaaS RBAC",
    artifactType: "PRD",
    content:
      "We need to implement role-based access control for our B2B SaaS platform. Admins define custom roles with granular permissions, audit logs for role changes and billing actions, plus scoped access per workspace.",
  },
  {
    title: "Backlog - Mobile Feedback",
    artifactType: "Backlog",
    content:
      "Mobile app to collect user feedback and ideas. Users submit title, description, category, optional images. Moderators approve/reject. Dashboard shows trending feedback and category filters.",
  },
  {
    title: "QA Pack - Checkout",
    artifactType: "QAPack",
    content:
      "E2E testing scope for checkout flow: cart, shipping methods, taxes, discounts, payment auth, error states, receipts. Include edge cases for invalid cards, timeouts, and retries.",
  },
  {
    title: "Risk Register - Data Residency",
    artifactType: "RiskRegister",
    content:
      "Data residency change for EU customers. Risks: compliance gaps, migration downtime, data loss, DPIA delays, vendor lock-in. Need mitigations and owners per risk with timelines.",
  },
  {
    title: "Critic Report - Observability",
    artifactType: "CriticReport",
    content:
      "Assess observability maturity for microservices: logging, tracing, metrics, alert noise, SLO coverage. Identify gaps and recommend prioritized improvements with impact and effort.",
  },
];
