# FAQ

## What is AI Delivery Copilot?
AI Delivery Copilot converts unstructured briefs into professional delivery artifacts (PRD, Backlog, QA Pack, Risk Register, Critic Report). It focuses on clarity, structure, and readiness for collaboration.

## What is Demo Mode and what data does it use?
Demo Mode runs entirely in the browser with deterministic local fixtures. It does not call external APIs or require API keys, and is ideal for onboarding and quick validation of UX and outputs.

## What is BYOK and where is my API key stored?
BYOK (Bring Your Own Key) lets you use a compatible OpenAI-like endpoint. Keys are set in the UI and stored in browser storage (sessionStorage, optionally localStorage). Keys are never added to URLs.

## Do share links include secrets?
No. Share links only serialize non-sensitive state (artifactType, brief — subject to length checks — tab, demo flag). They never include API keys or authorization headers.

## What is stored locally (history) and how to clear it?
The History feature can store recent runs (artifact, raw output) in the browser. You can clear the entire history or delete individual entries from the History panel.

## What are the supported artifact types?
PRD, Backlog, QAPack, RiskRegister, and CriticReport. Each has a schema and guardrails tailored to its structure and purpose.

## What is schema validation and the repair loop?
Outputs are validated using strict JSON schemas (Zod). If validation fails, a controlled repair loop attempts to fix structure and content while preserving safety constraints.

## Export formats: Markdown vs JSON (when to use each)
Use Markdown for human-readable handoffs (Jira, GitHub Issues, docs). Use JSON for programmatic workflows, integrations, or automated checks against downstream systems.

## Troubleshooting BYOK: base URL, key, CORS, network errors
Verify the provider base URL and API key in the UI. For CORS issues, use a local proxy or adjust server headers. Check network connectivity and timeouts if requests fail or stall.

## Privacy guidance: avoid sensitive data in briefs
Do not paste secrets, credentials, or personal data into briefs. Prefer synthetic or sanitized examples in Demo Mode; use BYOK only with data you can safely process.

## Keyboard shortcut: Ctrl/Cmd+Enter (how to use)
When focused on the brief textarea, press Ctrl+Enter (Windows/Linux) or Cmd+Enter (macOS) to trigger Generate, provided the app is not currently loading.

## How to report bugs / request features (Issue templates)
Open GitHub Issues using the provided templates: Bug report and Feature request. Include reproduction steps, expected behavior, and environment details when reporting bugs.
