# AI Delivery Copilot

A lightweight, zero-cost (self-hosted) React + TypeScript app that helps generate and validate delivery artifacts (e.g., PRD, Backlog, Risk Register, QA Pack) from a short brief.

It supports:
- **Mock provider** for deterministic, offline-friendly outputs (great for demos and tests)
- **BYOK (Bring Your Own Key)** provider for real LLM calls via an OpenAI-compatible `/chat/completions` endpoint (e.g., DeepSeek and similar providers)

## Why this exists

This project is designed as a portfolio-grade example of:
- Clean React state + UX patterns (request cancellation, stale-result guard, debug panel)
- Typed schemas + validation (Zod)
- Deterministic testing (Vitest)
- Practical “BYOK” integration patterns (local storage key management, configurable base URL + model)

## Quick start

```bash
npm ci
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Provider setup

### Mock (default)
No setup required. It returns deterministic JSON artifacts for the supported artifact types.

### BYOK (Bring Your Own Key)
1. Open **Provider Configuration** (top-right header button).
2. Select **BYOK**.
3. Set:
   - **API Base URL**: OpenAI-compatible endpoint base (example: `https://api.deepseek.com/v1`)
   - **API Key**: your key (optionally store it in `localStorage`)
   - **Model Name**: e.g. `deepseek-chat`

Notes:
- If you hit **CORS** in the browser, use a local proxy.
- The app expects **JSON-only** responses and will attempt repair if the model returns invalid JSON.

## Scripts

```bash
npm run dev       # local dev server
npm run build     # typecheck + production build
npm run preview   # preview production build
npm run lint      # eslint
npm test          # vitest (CI mode)
```

## Project structure (high level)

- `src/app/App.tsx` — main UI, cancellation + error mapping + debug output
- `src/lib/llm/` — provider implementations (mock + BYOK)
- `src/lib/schemas/` — Zod schemas for supported artifact types
- `src/lib/prompts.ts` — prompt and repair-prompt builder
- `tests/` — Vitest coverage for core modules

## Documentation

- `GETTING_STARTED.md` — usage and local proxy notes
- `README_MVP.md` — MVP scope and intended next steps
- `IMPLEMENTATION_SUMMARY.md` — implementation notes and key design decisions

## Roadmap (short)

- Add export formats (PDF/DOCX) for artifacts
- Add more artifact types and stricter schema constraints
- Add “artifact history” and saved briefs
- Add lightweight theming and layout polish

---

If you plan to publish this repo, do **not** commit real API keys. Use `.env.example` as a reference only.
