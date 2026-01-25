# AI Delivery Copilot — Case Study

## Contexto
En equipos de producto/ingeniería, el brief inicial suele ser desestructurado. Transformarlo en documentación consistente (PRD, backlog, QA, riesgos) consume tiempo y se vuelve un cuello de botella.

## Problema
- Fricción entre “idea” y “especificación ejecutable”.
- Outputs inconsistentes entre personas/equipos.
- Re-trabajo: criterios de aceptación incompletos, riesgos omitidos, QA tardío.

## Solución
AI Delivery Copilot convierte un brief en 5 artefactos de entrega estandarizados, con validación por esquema (Zod) y repair loop para garantizar estructura consistente.

## Diseño (decisiones clave)
- 100% estático (costo cero): sin backend ni DB.
- Esquemas Zod por artefacto: validación estricta.
- Repair loop controlado: reintentos acotados ante outputs inválidos.
- Demo Mode: fixtures determinísticos para demostrar valor sin API keys.

## Funcionalidades principales
- PRD / Backlog / QA Pack / Risk Register / Critic Report
- Export: JSON y Markdown
- History local + privacidad (inputs-only opcional)
- Share link para precargar estado sin backend

## Cómo se prueba (en 60s)
1. Abrir la demo.
2. Activar Demo Mode.
3. Elegir un Quick Brief.
4. Generar y exportar a Markdown.

## Limitaciones (intencionales)
- Sin autenticación ni colaboración en tiempo real.
- Persistencia local (localStorage/sessionStorage).
- No integra directamente Jira/Linear (pero exporta en formatos copiables).

## Próximos pasos
- Plantillas “Copy to Jira / GitHub Issues”
- Rubric de calidad visible + auto-check
- Docs más profundas: arquitectura, seguridad y changelog separados
