# AI Delivery Copilot

[![CI](https://github.com/Agus-Delgado/ai-Copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/Agus-Delgado/ai-Copilot/actions/workflows/ci.yml)

> Generador de artefactos de entrega: convierte briefs desestructurados en documentación profesional (PRD, Backlog, QA Pack, Riesgos y Critic Report) con validación por esquema, repair loop y modo demo sin costo. 100% estático, sin backend.

## Demo (Live)
- App: https://ai-copilot-wine-seven.vercel.app/
- Repo: https://github.com/Agus-Delgado/ai-Copilot

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
- 5 tipos de artefactos con esquemas Zod (validación estricta)
- Repair loop automático ante outputs inválidos
- Demo Mode sin costo (fixtures determinísticos)
- Quick Briefs / templates para onboarding rápido
- History local (últimas N ejecuciones) + privacidad (inputs-only opcional)
- Shareable links: precarga estado (tipo/brief/tab/demo) sin exponer secretos
- Export JSON/Markdown
- Cancelación de requests (AbortController)
- Tests (Vitest + React Testing Library) + CI

## Captura / GIF (recomendado)
Agregá un GIF corto (10–20s) del flujo completo en `docs/demo.gif` y referencialo aquí:

```md
![Demo](docs/demo.gif)
```

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

## Licencia
MIT — ver `LICENSE`.

## Contacto
- LinkedIn: https://www.linkedin.com/in/agustin-delgado-data98615190/
- GitHub: https://github.com/Agus-Delgado
- Email: augusto.delgado00@hotmail.com
