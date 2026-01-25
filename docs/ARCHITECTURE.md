# Architecture (AI Delivery Copilot)

## Objetivo
Convertir un brief desestructurado en artefactos de entrega estandarizados (PRD, Backlog, QA Pack, Riesgos, Critic Report) con guardrails, validación y una UX que permita probarlo sin costo.

## Diagrama (alto nivel)

UI (React)
  ├─ ArtifactSelector / BriefInput
  ├─ GenerateButton (AbortController)
  └─ OutputViewer (Markdown + JSON)
        |
        v
Generator (orchestrator)
  ├─ Prompt builder (por artefacto)
  ├─ Provider interface
  ├─ Zod schema validation
  └─ Repair loop (reintentos controlados)
        |
        v
Provider
  ├─ MockProvider (demo sin keys)
  └─ BYOKProvider (OpenAI-like API base URL + key)

## Principios de diseño
- Frontend-only para costo cero y despliegue simple (Vercel).
- Salidas estructuradas + validadas (Zod) para reducir “texto lindo pero inútil”.
- Fallos recuperables (repair) en vez de hard fail.
- Export Markdown/JSON y share links sin secretos.

## Puntos extensibles
- Nuevos artefactos: agregar schema + prompt + renderer.
- Nuevos exports: plantillas de “Copy to Jira / Issues”.
- Rubric de calidad: reglas simples en UI, sin servicios externos.
