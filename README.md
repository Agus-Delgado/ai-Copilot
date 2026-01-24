# AI Delivery Copilot

> Generador inteligente de artefactos de entrega. Transforma briefs desestructurados en documentación profesional con validación automática y reparación de esquemas. **Costo cero, sin backend, 100% estático.**

---

## 📊 Resumen

**AI Delivery Copilot** es una aplicación web que acelera la generación de documentación técnica para proyectos de software. Toma un brief textual desestructurado (problema, contexto, requisitos) y genera automáticamente cinco tipos de artefactos profesionales, validados y exportables:

- **PRD** (Requerimientos de Producto)
- **Backlog** (Épicas, historias, criterios de aceptación)
- **Risk Register** (Matriz de riesgos con mitigación)
- **QA Pack** (Planes de testing con escenarios)
- **Critic Report** (Análisis crítico y recomendaciones)

**Para quién:** Product managers, ingenieros, equipos ágiles y profesionales en portafolio que necesitan documentación estructurada sin invertir horas en redacción manual.

**Qué resuelve:** Elimina la fricción entre idea y especificación. Con soporte para proveedores LLM (Mock gratuito o BYOK con tu propia API), genera artefactos consistentes, reutilizables y listos para colaboración.

---

## 🎬 Demo

```
🚀 Demo en vivo: (próximamente)
📘 Guía de inicio rápido: Ver README_MVP.md
```

---

## ✨ Features principales

- **5 tipos de artefactos** con esquemas JSON validados mediante Zod
- **Generador con repair loop automático**: reintentos inteligentes (hasta 2) si la validación falla
- **Modo Mock gratuito**: respuestas determinísticas, sin API keys, ideal para desarrollo y demos
- **BYOK (Bring Your Own Key)**: integración con cualquier proveedor OpenAI-compatible (OpenAI, Deepseek, local LLM)
- **Exportación dual**: JSON estructurado + Markdown formateado por tipo
- **UI minimalista funcional**: 5 componentes React, layout 2-columnas, modal de configuración
- **3 demos precargados**: SaaS RBAC, Mobile Feedback App, Internal Reporting Tool
- **Testing completo**: Vitest con 22 tests (apiKeyStorage, schemas, generator, export)
- **100% estático**: deployable a Netlify, Vercel, GitHub Pages sin backend
- **TypeScript stricto**: compilación sin errores, type-safe end-to-end

---

## 🎯 Alcance del proyecto

### ✅ Incluye

- Generación de 5 tipos de artefactos con validación completa
- Orquestación de generación con reintentos automáticos
- Interfaz web responsiva para entrada y visualización
- Sistema de exportación (JSON + Markdown)
- Dos proveedores LLM (Mock + BYOK)
- Suite de tests unitarios y de integración
- API keys en sessionStorage/localStorage (usuario configura en UI, sin cifrado a nivel navegador)
- Manejo de errores con sugerencias contextuales
- Cancelación de requests (AbortController)

### ❌ No incluye

- Backend o base de datos
- Autenticación / multi-usuario
- Control de versiones de artefactos
- Colaboración en tiempo real
- Histórico persistente de generaciones
- CLI o integración en CI/CD
- Soporte para otras plataformas LLM (p.ej., Anthropic, Google)

---

## 🏗️ Arquitectura

### Flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                       Brief Input (UI)                          │
│                   (ArtifactSelector, BriefInput)                │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │    generateArtifact()         │
         │   (Generator Orchestrator)    │
         │  + Retry Loop (max 2)         │
         └────────┬────────────┬─────────┘
                  │            │
        ┌─────────▼──┐  ┌──────▼────────┐
        │ Prompt     │  │ LLM Provider  │
        │ Builder    │  │ Factory       │
        └────────────┘  ├─ Mock         │
                        ├─ BYOK         │
                        └─ (OpenAI-API)│
                             │
                         ┌───▼──────────────────┐
                         │  JSON Extraction &   │
                         │  Zod Validation      │
                         │  (Repair on error)   │
                         └───┬──────────────────┘
                             │
                        ┌────▼────────────┐
                        │ Artifact JSON   │
                        │ (Validated)     │
                        └────┬────────────┘
                             │
              ┌──────────────▼──────────────┐
              │    Export System            │
              ├─ toMarkdown() (formatted)   │
              ├─ toJson() (raw)             │
              └────┬─────────────────────────┘
                   │
            ┌──────▼──────────────┐
            │  Output Viewer (UI) │
            │  (Tabs, Copy, Dwn)  │
            └─────────────────────┘
```

### Componentes clave

**Frontend (React)**
- `App.tsx`: Orquestación principal, manejo de estado
- `ArtifactSelector.tsx`: Selector de tipo de artefacto
- `BriefInput.tsx`: Textarea + demos precargados
- `GenerateButton.tsx`: Botón con loader, cancela requests
- `OutputViewer.tsx`: Tabs JSON/Markdown, copiar, descargar
- `ProviderConfig.tsx`: Modal para configurar BYOK

**Backend (TypeScript / Lógica)**
- `generator.ts`: Orquestador con repair loop
- `providerFactory.ts`: Factory para instanciar proveedores
- `byokProvider.ts`: Cliente OpenAI-compatible
- `mockProvider.ts`: Respuestas determinísticas
- `prompts/index.ts`: Construcción de prompts y repair prompts
- `schemas/artifacts.ts`: Esquemas Zod para 5 artefactos
- `export/markdownExport.ts`: Exportadores (Markdown + JSON)
- `store.ts`: Zustand store para provider config

---

## 🛠️ Tech Stack

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Lenguaje** | TypeScript | ~5.9.3 |
| **Build** | Vite | 7.2.4 |
| **Validación** | Zod | 4.3.6 |
| **State Management** | Zustand | 5.0.10 |
| **Markdown Parsing** | Marked | 17.0.1 |
| **Testing** | Vitest | 4.0.18 |
| **Testing (React)** | @testing-library/react | 16.3.2 |
| **Linting** | ESLint | 9.39.1 |
| **Type Checking** | TypeScript strict | ✓ |

---

## 📦 Instalación y ejecución local

## 🔥 Smoke Test Checklist

- Generar artefacto en modo Mock muestra output.
- Cancelar muestra "Generation cancelled.".
- Cambiar entre tabs JSON/Markdown funciona.
- El panel de debug permite copiar el contenido.

---

## 📝 Changelog (Stages 0–6)

- Stage 0 — Baseline Quality
     - Prettier + ESLint alineados, scripts `lint`, `lint:fix`, `format`, `format:check`.
     - CI (Node 18/20) corre `npm ci`, `npm run lint`, `npm run test`, `npm run build`.
     - README incluye smoke checklist.

- Stage 1 — Rhythm & Design System
     - Tokens CSS en `src/index.css` (spacing, colores, tipografía, radius, shadow).
     - Layout consistente vía clases en `src/App.css` (sin estilos globales agresivos).
     - Responsive: <900px usa tabs Input/Output.
     - OutputViewer muestra Loading/Empty diferenciados.

- Stage 2 — Demo Mode + Quick Briefs
     - `demoMode` en `useStore` persistido en LocalStorage, toggle en header.
     - Quick briefs en `src/app/briefTemplates.ts` + selección desde `BriefInput`.
     - Mensajería: si falta key BYOK sugiere activar Demo mode.

- Stage 3 — Local History + Re-run
     - Historial en `useStore` con límite N=20 y cap ~200KB, eviction de antiguos.
     - Toggle `persistOutputs`: si off, guarda solo inputs.
     - `HistoryPanel` con búsqueda, View/Re-run/Delete/Clear.

- Stage 4 — Share Links
     - `Share link` copia URL con `artifactType`, `brief`, `tab` y `demo` (solo inputs).
     - Al abrir con parámetros, precarga el estado.
     - Parser robusto: ignora inválidos sin crash.

- Stage 5 — Validación + Error UX
     - Guardrails por tipo en prompts, mensajes de error accionables.
     - Debug muestra el `prompt` enviado y permite copiarlo.

- Stage 6 — Tests + CI Hardening
     - Tests nuevos: history, templates y URL state (RTL). Mantiene suites existentes.
     - CI matrix Node 18/20.

---

## ▶️ Comandos útiles

```bash
# Lint
npm run lint
npm run lint:fix

# Formato
npm run format
npm run format:check

# Tests
npm test

# Build
npm run build
```

### Requisitos previos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Pasos

#### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/ai-delivery-copilot.git
cd ai-delivery-copilot
```

#### 2. Instalar dependencias
```bash
npm install
```

#### 3. Ejecutar en desarrollo
```bash
npm run dev
```
Accede a `http://localhost:5173` en tu navegador.

#### 4. Compilación de producción
```bash
npm run build
```
Output estático en `dist/`. Listo para desplegar a Netlify, Vercel, GitHub Pages.

---

## 🚀 Deploy en Vercel

### Pasos para desplegar

#### 1. Conectar repositorio
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"New Project"**
3. Selecciona **"Import Git Repository"** y elige este repositorio (GitHub, GitLab, Bitbucket)

#### 2. Configurar build
Vercel detecta automáticamente que es un proyecto Vite + React. Verifica:

| Campo | Valor |
|-------|-------|
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

#### 3. Variables de entorno (opcional)
Para BYOK, configura SOLO lo siguiente en Vercel Dashboard → Proyecto → **Settings** → **Environment Variables**:

```
VITE_LLM_PROVIDER=byok
VITE_BYOK_API_BASE_URL=https://api.deepseek.com/v1
VITE_BYOK_MODEL=deepseek-chat
```

⚠️ **IMPORTANTE:** NO agregues `VITE_BYOK_API_KEY` aquí. Las variables `VITE_*` se compilan en el bundle (públicas). En su lugar:
1. El usuario configura la API key en la UI (ProviderConfig modal) después de desplegar
2. Se almacena en sessionStorage/localStorage (no en servidor)
3. Esto mantiene la key fuera del código y el bundle

#### 4. Deploy
Haz clic en **"Deploy"**. Vercel compilará y desplegará automáticamente (~2-3 minutos).

### Redeploys automáticos
- Cualquier push a `main` (o rama default) dispara un nuevo deploy
- Los previews de PR se crean automáticamente para cada Pull Request

### Verifica que funcione
1. Accede a la URL asignada por Vercel
2. Genera un artefacto con **Mock Provider** (default)
3. Verifica que no haya errores en la consola (F12 → Console)

---

## ⚙️ Configuración

### Variables de entorno

El proyecto funciona **sin configuración requerida** por defecto (modo Mock). Para usar BYOK (tu propia API), copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita los valores:

```dotenv
# Provider a usar: "mock" (gratuito) o "byok" (tu API)
VITE_LLM_PROVIDER=mock

# BYOK Settings (solo si VITE_LLM_PROVIDER=byok)
VITE_BYOK_API_BASE_URL=https://api.deepseek.com/v1
VITE_BYOK_API_KEY=sk_tu_clave_aqui
VITE_BYOK_MODEL=deepseek-chat
```

**Valores soportados:**
- `VITE_LLM_PROVIDER`: `"mock"` | `"byok"` (default: `"mock"`)
- `VITE_BYOK_API_BASE_URL`: URL base compatible con OpenAI API (p.ej., Deepseek, local LLM)
- `VITE_BYOK_API_KEY`: NO usar en .env (código es público); el usuario configura en la UI (ProviderConfig)
- `VITE_BYOK_MODEL`: Nombre del modelo (p.ej., `deepseek-chat`, `gpt-4`)

### Proveedores LLM

#### Mock Provider (Gratuito)
- **Costo:** $0
- **Uso:** Desarrollo, demos, testing
- **Comportamiento:** Respuestas determinísticas preconfiguradas
- **Activación:** Por defecto o `VITE_LLM_PROVIDER=mock`

#### BYOK Provider (Bring Your Own Key)
- **Costo:** Según tu proveedor (OpenAI, Deepseek, etc.)
- **Uso:** Producción, casos reales
- **Compatible con:** OpenAI API v1 (OpenAI, Deepseek, LM Studio, Ollama local)
- **Configuración:** Via UI (ProviderConfig modal); nunca hardcodear API keys en .env o variables
- **Storage:** sessionStorage (sesión actual) y localStorage (opcional "recordar"), sin cifrado a nivel navegador

**Flujo sin costo (desarrollo):**
1. Inicia con Mock Provider (por defecto)
2. Genera artefactos gratuitamente
3. Cuando necesites modelos reales, configura BYOK con tu API key

---

## 📋 Scripts disponibles

```bash
# Desarrollo
npm run dev           # Inicia servidor Vite + hot reload
npm run build         # Compila TypeScript + empaqueta (Vite)
npm run preview       # Previsualiza producción localmente

# Testing
npm test              # Ejecuta tests una vez
npm run test:watch   # Modo watch (rerun en cambios)
npm run test:ui      # Interfaz web Vitest (recomendado)

# Calidad de código
npm run lint          # Verifica ESLint + TS strict mode
```

---

## 🧪 Testing y calidad

### Cobertura

**22 tests** distribuidos en 4 suites:
- **apiKeyStorage.test.ts** (4 tests): Persistencia y lectura de API keys en sessionStorage/localStorage
- **schemas.test.ts** (7 tests): Validación Zod para 5 tipos de artefactos + union discriminada
- **generator.test.ts** (4 tests): Repair loop, extracción JSON, manejo de errores
- **export.test.ts** (7 tests): Exportación Markdown/JSON por tipo

### Ejecutar tests

```bash
# Una sola ejecución
npm test

# Watch mode (rerun en cambios)
npm run test:watch

# Interfaz web (recomendada)
npm run test:ui
# Abre http://localhost:51204 en navegador
```

### Linting

```bash
npm run lint
# Verifica ESLint + TypeScript strict mode
```

**Reglas:**
- TypeScript `strict: true`
- ESLint con soporte React 19
- No tolerados: variables sin usar, tipos implícitos, etc.

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Completada)
- [x] Scaffolding Vite + React + TypeScript
- [x] 5 tipos de artefactos con Zod
- [x] Generator con repair loop
- [x] Mock + BYOK providers
- [x] UI minimalista (5 componentes)
- [x] Testing (22 tests covering core modules)

### Phase 2: Mejoras UX (Próximas)
- [ ] Editor de artefactos (editar campos post-generación)
- [ ] Historial local (IndexedDB o localStorage)
- [ ] Templates personalizados (pre-llenar campos)
- [ ] Syntax highlighting en output (JSON/Markdown)
- [ ] Dark mode / Light mode

### Phase 3: Extensión de features
- [ ] Más tipos de artefactos (OKRs, Test Plans, Technical Spec)
- [ ] Soporte para Anthropic Claude API
- [ ] Batch generation (múltiples briefs)
- [ ] Colaboración básica (share URL con output)
- [ ] API REST simple (para integraciones)

### Phase 4: Enterprise (Futuro)
- [ ] Autenticación + multi-usuario
- [ ] Base de datos persistente (historia de generaciones)
- [ ] Audit log
- [ ] Custom models fine-tuning
- [ ] SSO integración

---

## 🤝 Contribución

Este proyecto es de código abierto y las contribuciones son bienvenidas. Pasos recomendados:

1. **Fork** el repositorio
2. **Crea una rama** para tu feature (`git checkout -b feature/mi-feature`)
3. **Commit tus cambios** (`git commit -m "Agregar mi feature"`)
4. **Push a la rama** (`git push origin feature/mi-feature`)
5. **Abre un Pull Request**

### Reportar bugs

Si encuentras un error, por favor abre un **Issue** con:
- Descripción clara del problema
- Pasos para reproducir
- Versión de Node/npm
- Logs relevantes

---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**. Ver archivo `LICENSE` para detalles.

> Si no existe licencia en el repositorio, agrega:
> ```
> MIT License (c) 2026 [Tu Nombre]
> Permission is hereby granted, free of charge...
> ```

---

## 🙏 Créditos y agradecimientos

- **Autor principal:** [Tu Nombre]
- **Asistencia AI:** GitHub Copilot (Claude) para arquitectura, validación y testing
- **Comunidad:** Inspiración en arquitecturas de Vite, Zod, Zustand
- **Portfolio:** Este proyecto fue desarrollado como demostración de full-stack web development con TypeScript, React y validación robusta.

---

## 📞 Contacto y soporte

- 📧 Email: augusto.delgado00@hotmail.com
- 🐙 GitHub: https://github.com/Agus-Delgado
- 💼 LinkedIn: https://www.linkedin.com/in/agustin-delgado-data98615190/
- 🌐 Portfolio: https://portfolio-virid-alpha-97.vercel.app/

---

## 📋 Verificación pre-release

**Checklist de validación:**

- [ ] **Demo:** Agregue link a demo en vivo o aclarar "(próximamente)"
- [ ] **Licencia:** Crear archivo `LICENSE` con MIT o tu opción
- [ ] **API Keys ejemplo:** Validar que `.env.example` tiene valores seguros (no expuestos)
- [ ] **Créditos:** Llenar [Tu Nombre] con autor real
- [ ] **Contacto:** Actualizar email, GitHub, LinkedIn
- [ ] **Tests:** Ejecutar `npm test` y confirmar que pasan
- [ ] **Build:** Ejecutar `npm run build` y verificar `dist/` sin errores
- [ ] **Lint:** Ejecutar `npm run lint` sin warnings
- [ ] **README en GitHub:** Pushear esta versión a `main`
- [ ] **Links:** Testear que todos los links internos funcionan
- [ ] **TypeScript:** Confirmar `npm run build` compila sin errores TS

---

**Última actualización:** Enero 23, 2026  
**Versión:** 0.1.0 (MVP)  
**Status:** ✅ Production-Ready
