# Contributing to AI Delivery Copilot

Thanks for your interest in contributing. This repository is designed to be simple to run locally and safe to evaluate in **Demo Mode** without API keys.

## Project principles
- **Zero-cost by default:** Demo Mode works with local fixtures.
- **Frontend-only:** no backend services required.
- **Safety & privacy:** API keys must never be committed or exposed via build-time `VITE_*` variables.
- **Schema-first outputs:** generated artifacts are validated (Zod). Prefer changes that preserve output structure.

## Getting started

### Prerequisites
- Node.js 18+ (recommended)
- npm

### Install & run
```bash
git clone https://github.com/Agus-Delgado/ai-Copilot.git
cd ai-Copilot
npm install
npm run dev
```

## Demo Mode vs BYOK
- Demo Mode: uses deterministic fixtures; ideal for verifying UX and outputs quickly.
- BYOK (Bring Your Own Key): user configures provider base URL and key in the UI.
- Keys may be stored in browser storage (session/local), depending on app settings.
- Keys must never be included in URLs, logs, or committed files.

## Security guidelines
- Do not add secrets to the repo.
- Do not store secrets in build-time env vars with VITE_* prefix.
- If you introduce any new “share link” behavior, ensure it serializes only non-sensitive state.
- More details: see docs/SECURITY.md.

## Output quality expectations
- Keep required sections stable.
- Prefer explicit Acceptance Criteria (Given/When/Then).
- Include assumptions and out-of-scope where relevant.
- Keep outputs copy/paste-friendly for real workflows (Jira / GitHub Issues).

## Reporting bugs / requesting features
- Please use GitHub Issues:
  - Bug report template
  - Feature request template

## Code style
- Prefer small, readable functions and explicit naming.
- Avoid large refactors unless necessary.
- Keep UI changes accessible (focus states, aria labels where applicable).

## License
- By contributing, you agree that your contributions will be licensed under the MIT License (see LICENSE).
