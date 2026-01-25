# Architectural Decisions

## 1) Frontend-only architecture (zero-cost deploy)
Context: The project aims to be accessible and cost-free to evaluate and share.
Decision: Implement a static, frontend-only app without a backend or remote DB.
Consequences: Easy deploy and low maintenance; limited server-side processing; BYOK needed for model calls.

## 2) Schema validation with Zod
Context: Generated outputs must be reliable and structured for collaboration.
Decision: Validate outputs against strict Zod schemas per artifact type.
Consequences: Early detection of invalid data; clear contracts; extra effort to keep schemas aligned with UX.

## 3) Controlled repair loop for invalid outputs
Context: Model outputs can be malformed or incomplete.
Decision: Implement a bounded repair loop to correct structure and content while preserving constraints.
Consequences: Improved success rate and stability; predictable retries; avoids unbounded or opaque recovery logic.

## 4) Demo Mode with deterministic fixtures
Context: Onboarding and demos must work without costs or external services.
Decision: Provide Demo Mode that uses local fixtures to simulate outputs deterministically.
Consequences: Zero-cost evaluation; no secrets; limited realism vs. live APIs; ideal for quick validation.

## 5) Share links serialize only non-sensitive state
Context: Sharing app state should be safe and usable in real workflows.
Decision: Encode only artifactType, brief (length-checked), tab, and demo flags; never include secrets.
Consequences: Safe collaboration; predictable URL state; requires BYOK configuration for live generation.
