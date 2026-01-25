# Security & Privacy (AI Delivery Copilot)

## Arquitectura y superficie de ataque
- Aplicación 100% estática (frontend only).
- No hay backend propio ni base de datos remota del proyecto.
- La persistencia es local en el navegador (sessionStorage/localStorage).

## BYOK (Bring Your Own Key)
- La API key se configura en la UI.
- Recomendación: guardar en `sessionStorage` por defecto y usar `localStorage` solo si el usuario lo pide explícitamente.
- Nunca exponer la key en URLs, logs de consola, ni errores serializados.

## Variables de entorno (Vercel / build)
**Importante:** no colocar claves en variables `VITE_*`.
- En Vite, cualquier variable con prefijo `VITE_` termina embebida en el bundle del cliente.
- Por lo tanto, `VITE_*_API_KEY` no debe usarse para secretos.

## Share links
- Los links compartibles deben serializar solo estado no sensible (tipo de artefacto, brief, pestaña, flags).
- Confirmar que no se incluya ninguna API key ni headers.

## Datos del usuario
- Evitar guardar outputs completos por defecto si el brief puede contener datos sensibles.
- Recomendación: “privacy mode (inputs-only)” como opción.

## Buenas prácticas recomendadas
- Sanitizar y limitar el tamaño de inputs en UI.
- Manejar timeouts y cancelación (AbortController).
- Evitar enviar información adicional del navegador al provider.
