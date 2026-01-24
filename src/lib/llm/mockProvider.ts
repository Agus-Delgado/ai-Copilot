import type { LLMProvider } from "./types";

const MOCKS: Record<string, unknown> = {
  PRD: {
    artifactType: "PRD",
    title: "RBAC and Audit Logs for B2B SaaS",
    problemStatement: "Users can access sensitive resources without role separation; no audit trail.",
    goals: ["Introduce role-based access control", "Provide audit logs for sensitive actions"],
    nonGoals: ["Implement SSO/SAML", "Implement SCIM provisioning"],
    targetUsers: ["Owner", "Admin", "Member", "Viewer"],
    scope: {
      inScope: ["Roles & permissions UI", "Audit log events & filters"],
      outOfScope: ["SSO/SCIM"],
    },
    functionalRequirements: [
      { id: "FR-1", description: "Assign roles per tenant with default migration.", priority: "Must" },
      { id: "FR-2", description: "Log sensitive actions (role changes, billing, exports).", priority: "Must" },
    ],
    nonFunctionalRequirements: [
      { id: "NFR-1", category: "Security", description: "Least privilege enforced server-side." },
      { id: "NFR-2", category: "Compliance", description: "Audit logs retained for 90 days (configurable)." },
    ],
    assumptions: ["Existing tenants can be migrated with default roles safely."],
    dependencies: ["User service", "Billing module"],
    successMetrics: ["Reduced permission incidents by 80%", "Audit log adoption by 90% of admins"],
    risks: [
      { id: "R-1", description: "Migration assigns overly broad roles.", mitigation: "Dry-run + rollback plan." },
    ],
  },
  Backlog: {
    artifactType: "Backlog",
    productArea: "RBAC & Audit",
    epics: [
      {
        id: "E-1",
        title: "Role-Based Access Control",
        goal: "Enable fine-grained permission management",
        stories: [
          {
            id: "S-1",
            title: "Define role hierarchy",
            userStory: "As an admin, I want to define custom roles with specific permissions, so that I can control access granularly.",
            acceptanceCriteria: [
              "Roles can be created with custom permission sets",
              "Default roles (Owner, Admin, Member, Viewer) are pre-loaded",
              "Role hierarchy is enforced",
            ],
            priority: "P0",
            estimate: 5,
            relatedRequirementIds: ["FR-1"],
            tags: ["backend", "core"],
          },
          {
            id: "S-2",
            title: "UI for role assignment",
            userStory: "As an admin, I want to assign roles to users via UI, so that I don't need database access.",
            acceptanceCriteria: [
              "Role assignment page shows users and current roles",
              "Bulk assign roles option",
              "Confirmation dialog for role changes",
            ],
            priority: "P0",
            estimate: 3,
            relatedRequirementIds: ["FR-1"],
            tags: ["frontend", "ui"],
          },
        ],
      },
      {
        id: "E-2",
        title: "Audit Logging",
        goal: "Track all sensitive actions",
        stories: [
          {
            id: "S-3",
            title: "Implement audit event tracking",
            userStory: "As a security officer, I want to track all role changes and sensitive actions, so that I can audit compliance.",
            acceptanceCriteria: [
              "All role changes are logged",
              "Logs include actor, action, timestamp, old/new values",
              "Logs are immutable (append-only)",
            ],
            priority: "P0",
            estimate: 4,
            relatedRequirementIds: ["FR-2"],
            tags: ["backend", "security"],
          },
        ],
      },
    ],
  },
  RiskRegister: {
    artifactType: "RiskRegister",
    context: "RBAC & Audit Logs implementation for B2B SaaS platform",
    risks: [
      {
        id: "R-1",
        category: "Security",
        risk: "Overly permissive default role assignments during migration",
        likelihood: 3,
        impact: 4,
        mitigation: "Dry-run migration on staging; rollback plan; manual review",
        owner: "Security Lead",
        status: "Mitigating",
      },
      {
        id: "R-2",
        category: "Compliance",
        risk: "Audit logs not retained for required 90 days",
        likelihood: 2,
        impact: 5,
        mitigation: "Implement log retention policy; automated archival to cold storage",
        owner: "Backend Lead",
        status: "Open",
      },
      {
        id: "R-3",
        category: "Technical",
        risk: "Performance degradation from audit log writes",
        likelihood: 2,
        impact: 3,
        mitigation: "Async logging; batching; separate audit database replica",
        owner: "Infrastructure Lead",
        status: "Open",
      },
    ],
  },
  QAPack: {
    artifactType: "QAPack",
    featureUnderTest: "Role-Based Access Control",
    testCases: [
      {
        id: "TC-1",
        title: "Admin assigns role to user successfully",
        type: "HappyPath",
        preconditions: ["Admin is logged in", "Target user exists in system"],
        steps: [
          "Navigate to User Management page",
          "Search for target user",
          "Click 'Assign Role'",
          "Select new role from dropdown",
          "Click 'Confirm'",
        ],
        expectedResults: [
          "Role is updated in system",
          "User sees updated permissions immediately",
          "Audit log entry is created",
        ],
        testData: ["User: john@company.com", "Role: Editor"],
      },
      {
        id: "TC-2",
        title: "Non-admin cannot assign roles",
        type: "Security",
        preconditions: ["User with 'Member' role is logged in"],
        steps: [
          "Try to navigate to /admin/users",
          "Observe response",
        ],
        expectedResults: [
          "User is redirected to /forbidden or sees 403 error",
          "No audit log entry for unauthorized attempt",
        ],
        testData: ["User: member@company.com"],
      },
    ],
    checklist: [
      "All CRUD operations for roles tested",
      "Permission enforcement verified",
      "Audit logs verified for all sensitive actions",
      "Load testing completed (>100 role assignments/sec)",
      "Regression tests passed",
    ],
  },
  CriticReport: {
    artifactType: "CriticReport",
    summary: "RBAC brief is well-structured but lacks details on role provisioning for third-party integrations and edge cases.",
    ambiguities: [
      "What happens when a user has conflicting roles (e.g., both Editor and Viewer)?",
      "How are roles handled during team/org restructuring?",
    ],
    inconsistencies: [
      "PRD mentions 'default migration' but Backlog doesn't specify migration strategy",
      "Success metric says '80% reduction' but baseline is not defined",
    ],
    missingInformationQuestions: [
      "Should guest users have a separate permission model?",
      "Is there a need for time-limited role assignments?",
      "How are API keys and service accounts handled in RBAC?",
      "What audit retention policy is required by compliance (GDPR, SOC2, etc.)?",
    ],
    risksOrConcerns: [
      "Role explosion: risks having too many custom roles making management difficult",
      "Migration data quality: existing data may not map cleanly to new role structure",
    ],
    recommendedNextSteps: [
      "Define role provisioning API for third-party integrations",
      "Create migration playbook with automated validation steps",
      "Conduct security review with compliance team",
      "Prototype UI to validate UX before full implementation",
    ],
  },
};

export class MockProvider implements LLMProvider {
  async complete(prompt: string, signal?: AbortSignal): Promise<string> {
    void signal;
    const type =
      prompt.includes("Artifact type: Backlog") ? "Backlog" :
      prompt.includes("Artifact type: RiskRegister") ? "RiskRegister" :
      prompt.includes("Artifact type: QAPack") ? "QAPack" :
      prompt.includes("Artifact type: CriticReport") ? "CriticReport" :
      "PRD";

    const obj = MOCKS[type] ?? { artifactType: type, note: "Mock not defined" };
    return JSON.stringify(obj, null, 2);
  }
}
