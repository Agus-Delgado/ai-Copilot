# AI Delivery Copilot — A Paradise Module

[![CI](https://github.com/Agus-Delgado/ai-Copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/Agus-Delgado/ai-Copilot/actions/workflows/ci.yml)

> Generador de artefactos de entrega: convierte briefs desestructurados en documentación profesional (PRD, Backlog, QA Pack, Riesgos y Critic Report) con validación por esquema, repair loop y modo demo sin costo. 100% estático, sin backend.

## Demo (Live)
- App: https://ai-copilot-wine-seven.vercel.app/
- Repo: https://github.com/Agus-Delgado/ai-Copilot

### One-Click Try Demo
No sign-up, no API keys needed. Open the live app and click **"Try Demo"** to generate artifacts with pre-loaded fixtures. Perfect for portfolio demos and quick onboarding.

**Dark Mode:**  Toggle theme in **Settings** (top-right) — persisted to local storage, respects system preference on first visit.

## How to Demo in 60 Seconds
1. **Open** https://ai-copilot-wine-seven.vercel.app/
2. **Enable** Demo Mode in Settings (no API keys required)
3. **Select** a Quick Brief or paste your own
4. **Generate** → review artifact → **Export** as Markdown/JSON

## 🧠 Paradise Ecosystem

**Paradise** is an AI-first ecosystem designed to host multiple intelligent tools focused on solving real-world business and operational problems through Artificial Intelligence.

Rather than a single application, Paradise functions as a **modular platform**, where each product delivers a specific capability while sharing a common AI-driven philosophy:  
**decision intelligence, automation, and productivity at scale.**

Paradise solutions are built on:
- Generative AI
- Machine Learning
- Deep Learning
- Data-driven decision systems
- Intelligent automation

Each module can operate independently, but gains additional value as part of the broader Paradise ecosystem.

### AI Delivery Copilot Role within Paradise

**AI Delivery Copilot** is a core module within Paradise, focused on **Build & Delivery (Generative AI)**.

It accelerates product delivery workflows by generating structured outputs such as:
- PRDs and specs
- Backlogs and user stories
- QA packs and test scenarios
- Documentation artifacts

AI Delivery Copilot is designed as a standalone tool while also serving as a foundational productivity pillar of the Paradise ecosystem.

### Paradise Capability Pillars (High-level)

Paradise is structured around AI capability pillars, including:

- **Ops & Decision Intelligence**  
  Metrics, observability, alerts, and AI-assisted operational decisions.  
  → *AtlasOps*

- **Build & Delivery (Generative AI)**  
  AI copilots for product development, documentation, backlog generation, and QA.  
  → *AI Delivery Copilot*

Additional modules and pillars may be introduced as the ecosystem evolves.

## Qué resuelve
Entre una idea (brief) y una especificación útil hay fricción: estructura, consistencia, criterios de aceptación, riesgos y calidad del output.
AI Delivery Copilot estandariza ese paso: genera artefactos listos para colaborar, exportar y reutilizar.

## Para quién
Product Managers, equipos ágiles, engineering leads y profesionales de portfolio que necesitan documentación clara y consistente sin invertir horas de redacción manual.

## Qué podés generar
- **PRD**: objetivos, alcance, requisitos, supuestos, métricas
- **Backlog**: épicas, historias y criterios de aceptación
- **QA Pack**: casos de prueba, escenarios, checklist
- **Risk Register**: riesgos, probabilidad/impacto, mitigación
- **Critic Report**: gaps, inconsistencias, recomendaciones

## Cómo funciona (alto nivel)
1. Seleccionás un tipo de artefacto y pegás/escribís un brief.
2. El generador construye el prompt con guardrails por tipo.
3. La salida se valida con **Zod** (JSON estricto). Si falla, corre un **repair loop** (reintentos controlados).
4. Exportás **JSON** (raw) o **Markdown** (formateado).
5. Opcional: guardás en **History** (local) y compartís con **Share link** (sin backend).

## Modos de ejecución
### Demo Mode (costo $0)
- Corre 100% en el cliente con fixtures locales (sin API keys).
- Ideal para probar, mostrar y hacer onboarding.

### BYOK (Bring Your Own Key)
- Compatible con endpoints OpenAI-like (p. ej. OpenAI, Deepseek, modelos locales con API compatible).
- La API key se configura en UI y se guarda en `sessionStorage` (y opcionalmente `localStorage`), **nunca** se incluye en URLs.

## Features destacadas
- **5 artifact types** with strict Zod validation
- **Repair loop**: automatic retry on invalid outputs
- **Demo Mode**: zero-cost with deterministic fixtures (no API keys)
- **Quick Briefs**: pre-built templates for instant value
- **Dark Mode**: theme toggle + system preference detection + localStorage persistence
- **History**: local storage of last N generations + privacy controls
- **Share Links**: encode state (type/brief/output/mode) without exposing secrets
- **Export**: JSON (raw) + Markdown (formatted)
- **Request cancellation**: AbortController support
- **Tests**: Vitest + React Testing Library + CI/CD

## Tech Stack
- **React + TypeScript + Vite**: fast dev experience, type safety, HMR
- **Zod schema validation + repair loop**: strict output validation with automatic retry
- **Vitest + React Testing Library + CI**: comprehensive test coverage with GitHub Actions

## Captura / GIF 
![Demo](docs/demo.gif)

> Flujo rápido: Quick Brief → Generate → Critic Report → Export/Share (Demo Mode).

## Quick Start (local)
Requisitos: Node.js 18+ y npm.

```bash
git clone https://github.com/Agus-Delgado/ai-Copilot.git
cd ai-Copilot
npm install
npm run dev
```

## Scripts
```bash
npm run lint
npm test
npm run build
npm run preview
```

## Zero-Cost Deployment
- **100% static** frontend → free hosting on Vercel (or any CDN)
- **No backend** required → no server costs
- **No database** → all state stored in browser (localStorage/sessionStorage)
- Demo Mode generates local fixtures → zero API calls for testing

## Limitaciones (scope)
- **100% static**: no backend / no DB remota
- **BYOK keys** stay in the user's browser (not stored server-side)
- **Share links** encode state in URL (may get long depending on output)
- **Not designed** for multi-user collaboration/auth (out of scope for now)

## Seguridad y privacidad (resumen)
- Proyecto 100% estático: no hay backend ni DB remota.
- **No** colocar `VITE_*_API_KEY` en Vercel/CI: las variables `VITE_*` se exponen en el bundle.
- BYOK: la key queda en el navegador del usuario (session/local storage), nunca en el repo ni en URLs.

Detalles: ver `docs/SECURITY.md`.

## Documentación adicional
- `CASE_STUDY.md`
- `ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/CHANGELOG.md`
- `docs/SECURITY.md`
- `docs/EXPORT_TEMPLATES.md`
- `CONTRIBUTING.md`
- `docs/FAQ.md`
- `docs/DECISIONS.md`
- `docs/LIGHTHOUSE.md`

## Licencia
MIT — ver `LICENSE`.

## Contacto
- LinkedIn: https://www.linkedin.com/in/agustin-delgado-data98615190/
- GitHub: https://github.com/Agus-Delgado
- Email: augusto.delgado00@hotmail.com
