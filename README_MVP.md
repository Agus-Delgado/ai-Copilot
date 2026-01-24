# AI Delivery Copilot — MVP Scaffold

> Generador de artefactos documentación acelerado por IA. Transforma briefs desestructurados en PRD, Backlog, Risk Register, QA Pack, y Critic Report—100% estático, sin backend.

## 🎯 Características

- **5 tipos de artefactos** con esquemas JSON validados (Zod)
- **2 proveedores LLM**: Mock determinístico + BYOK (Bring Your Own Key)
- **Repair loop automático**: reintenta hasta 2 veces si falla la validación
- **Exportación dual**: JSON estructurado + Markdown formateado
- **UI mínima funcional**: selector tipo, textarea brief, botón generate, tabs output
- **3 demos precargados**: SaaS RBAC, Mobile Feedback App, Internal Reporting Tool
- **Testing**: Vitest con 3 suites core (schemas, generator repair loop, export markdown)
- **100% estático**: deployable a Netlify, Vercel, GitHub Pages

---

## 🚀 Quick Start

### Instalar dependencias

```bash
npm install
```

### Modo desarrollo

```bash
npm run dev
```

Abre http://localhost:5173 en tu navegador.

### Compilación de producción

```bash
npm run build
```

Output estático en `dist/`. Listo para deployar.

### Tests

```bash
npm test          # Ejecuta tests una vez
npm run test:watch # Modo watch
npm run test:ui    # Interfaz web
```

---

## 📦 Estructura de carpetas

```
src/
├── app/                    # Componente principal App
├── components/             # UI componentes reutilizables
│   ├── ArtifactSelector.tsx
│   ├── BriefInput.tsx
│   ├── GenerateButton.tsx
│   ├── OutputViewer.tsx
│   └── ProviderConfig.tsx
├── lib/
│   ├── schemas/
│   │   └── artifacts.ts         # 5 esquemas Zod (PRD, Backlog, etc)
│   ├── llm/
│   │   ├── types.ts             # Interface LLMProvider
│   │   ├── mockProvider.ts       # Mock determinístico
│   │   ├── byokProvider.ts       # OpenAI-compatible provider
│   │   └── generator.ts          # Orquestador con repair loop
│   ├── prompts/
│   │   └── index.ts             # buildPrompt() y buildRepairPrompt()
│   ├── export/
│   │   └── markdownExport.ts    # toMarkdown() y toJson()
│   └── store.ts                 # Zustand store (providerConfig)
├── features/                # Reservado para v1+ (RAG, integraciones)
└── styles/                 # Global CSS

tests/
├── schemas.test.ts         # Validación de 5 esquemas
├── generator.test.ts       # Repair loop y generateArtifact()
└── export.test.ts          # Markdown/JSON export

```

---

## 🏗️ Arquitectura

### Flujo de generación

```
User Input (brief + artifact type)
        ↓
Selector de Provider (Mock / BYOK)
        ↓
generateArtifact(provider, type, brief)
        ├→ buildPrompt() → LLM API call
        ├→ Parsea JSON (primeros {} a últimos })
        ├→ Valida con Zod schema
        ├→ ❌ Falla? → buildRepairPrompt() → Reintenta (máx 2 veces)
        └→ ✅ Éxito → return { artifact, raw }
        ↓
Export (toJson + toMarkdown)
        ↓
UI Tabs: JSON | Markdown
```

### Providers

**MockProvider** (por defecto)
- Devuelve JSON pre-generados determinísticos
- Perfecto para testing y demos
- Respuestas realistas para 5 tipos de artefacto

**ByokProvider**
- Conecta a endpoint OpenAI-compatible (DeepSeek, etc)
- API key configurada en UI (no guardada en código)
- Configurable: baseUrl, model name, temperatura

### Schemas Zod

Cada artefacto define su estructura JSON:

| Artifact | Campos clave |
|----------|--------------|
| **PRD** | title, problemStatement, goals, scope, functionalRequirements, nonFunctionalRequirements, successMetrics, risks |
| **Backlog** | productArea, epics[{ stories[{ userStory, acceptanceCriteria }] }] |
| **RiskRegister** | context, risks[{ category, likelihood, impact, mitigation, status }] |
| **QAPack** | featureUnderTest, testCases[{ steps, expectedResults }], checklist |
| **CriticReport** | summary, missingInformationQuestions, ambiguities, inconsistencies, risksOrConcerns |

---

## 🧪 Tests

### Cobertura

- **schemas.test.ts**: Validación de 5 tipos + discriminación correcta
- **generator.test.ts**: Repair loop (falla en 1er intento, recupera en 2do), exhaustión de reintentos
- **export.test.ts**: Markdown/JSON output por cada tipo, arrays vacíos

### Ejecución

```bash
npm test
# Output:
# ✓ tests/schemas.test.ts (7 tests)
# ✓ tests/generator.test.ts (4 tests)
# ✓ tests/export.test.ts (7 tests)
# Test Files 3 passed (3) | Tests 18 passed (18)
```

---

## ⚙️ Configuración

### Ambiente variables (.env)

```env
# Default: mock
VITE_LLM_PROVIDER=mock

# Solo si VITE_LLM_PROVIDER=byok
VITE_BYOK_API_BASE_URL=https://api.deepseek.com/v1
VITE_BYOK_API_KEY=sk_...
VITE_BYOK_MODEL=deepseek-chat
```

### Provider en UI

Click botón **⚙ Provider Config** en header para cambiar modo y configurar BYOK.

---

## 📋 Esquemas de ejemplo

### PRD Mínimo Válido

```json
{
  "artifactType": "PRD",
  "title": "RBAC for B2B SaaS",
  "problemStatement": "Users can access sensitive resources without role separation",
  "goals": ["Introduce role-based access control"],
  "targetUsers": ["Admin", "Member"],
  "scope": {
    "inScope": ["Roles & permissions UI"],
    "outOfScope": ["SSO/SAML"]
  },
  "functionalRequirements": [
    {"id": "FR-1", "description": "Assign roles per user", "priority": "Must"}
  ],
  "successMetrics": ["80% permission incidents reduced"]
}
```

---

## 🎨 UI Componentes

- **ArtifactSelector**: Dropdown con 5 tipos
- **BriefInput**: Textarea + selector demo briefs (precargados)
- **GenerateButton**: Botón con loading state
- **OutputViewer**: Tabs (JSON | Markdown), copy + download
- **ProviderConfig**: Modal para cambiar provider + credenciales

---

## 📝 Demos Precargados

1. **SaaS RBAC**: Role-based access control para B2B SaaS
2. **Mobile Feedback**: App de feedback con categorización
3. **Internal Reporting**: Herramienta interna de reportes

---

## 🔄 Repair Loop

Si el LLM devuelve JSON inválido:

1. **Intento 1**: Llamada inicial
2. **Intento 2 (si falla)**: Reenvía JSON + error de Zod + prompt de reparación
3. **Intento 3 (si falla)**: Último reintento
4. **Falla final**: Error con contexto (última salida sin procesar)

Máximo **2 reintentos** → 3 intentos totales.

---

## 🚢 Deployment

### Netlify / Vercel

```bash
npm run build
# Deployar carpeta `dist/`
```

### GitHub Pages

```bash
npm run build
# git add dist/
# git commit && git push origin main
```

### Variables de entorno en producción

Configurar en dashboard del proveedor (Netlify, Vercel):
- `VITE_LLM_PROVIDER=mock` (o `byok`)
- `VITE_BYOK_API_BASE_URL=...`
- `VITE_BYOK_API_KEY=...` (mantener secreto)

---

## 📦 Dependencias

### Core

- `react` 19 — UI framework
- `react-dom` 19 — React bindings
- `typescript` 5.9 — Type safety
- `zod` 4 — Schema validation
- `zustand` 5 — State management
- `vite` 7 — Build tool

### Dev

- `vitest` 4 — Unit testing
- `@testing-library/react` 16 — React testing
- `jsdom` — DOM simulation para tests
- `@vitejs/plugin-react` 5 — React plugin para Vite

---

## 🎯 Roadmap

### v1.0 ✅

- [x] 5 artefactos con schemas validados
- [x] Mock + BYOK providers
- [x] Repair loop automático
- [x] Export JSON/Markdown
- [x] UI mínima funcional
- [x] Vitest suite core

### v1.1 (Próximo)

- [ ] Document upload (PDF, DOCX)
- [ ] RAG: chunking + embeddings + retrieval
- [ ] Citas en outputs (artifact references documents)
- [ ] Historial de artefactos (localStorage)
- [ ] Jira/Linear integration

### v2.0 (Future)

- [ ] Backend opcional (para autenticación + RAG server)
- [ ] Multi-user workspaces
- [ ] Fine-tuning evaluation con golden set
- [ ] Streaming responses en UI

---

## 🤝 Contribuyendo

1. Fork el repo
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Commit cambios (`git commit -m "Add feature"`)
4. Push (`git push origin feature/mi-feature`)
5. Open Pull Request

---

## 📄 Licencia

MIT — Usa libremente en tus proyectos.

---

## 📧 Support

Para preguntas o issues, abre un GitHub Issue o contacta al equipo de delivery.

---

**Última actualización:** Enero 2026  
**Versión:** 0.1.0 (MVP)
