# Handoff — CatMatch

## Sesión — 2026-06-24 (Fix: subir foto desde iPhone fallaba)

### Qué hemos hecho
- **Corregido el error "The string did not match the expected pattern"** que salía al subir
  una foto desde iPhone en la pantalla "Analizando…". Causa raíz: la foto se enviaba **tal
  cual** a `/api/match`. Las fotos de iPhone son **HEIC** (el pipeline asume JPEG) y **grandes**
  (3–5 MB; Vercel rechaza cuerpos > ~4.5 MB).
- **Nuevo `lib/image.ts` → `normalizeImage(file)`**: en el propio móvil decodifica
  (`createImageBitmap` con `imageOrientation: 'from-image'`, con fallback a `<img>`), reescala a
  máx. 1600 px de lado y re-codifica a **JPEG** (`canvas.toBlob`, calidad 0.85). Respeta la
  orientación EXIF. Defensivo: ante cualquier fallo devuelve el archivo original (nunca lanza).
- **`app/page.tsx` (`handleCapture`)**: normaliza la foto una sola vez al capturarla y reutiliza
  el JPEG resultante para el match, la vista previa, la detección de color y para guardar la
  ficha (`fileRef`). No se tocaron APIs ni base de datos (el contrato FormData no cambia).
- Efecto colateral positivo de privacidad: el reescalado **elimina los metadatos EXIF** (incl.
  GPS incrustado en la imagen). El GPS funcional se sigue tomando aparte vía `getPosition()`.
- v0.2.13 + entrada en CHANGELOG. `npx tsc --noEmit` pasa limpio.

### Estado actual
🟡 **v0.2.13 en la rama `claude/mobile-photo-upload-error-lztut9`** (pusheada, **no** mergeada
   a `main` todavía — se trabajó en rama de feature, no en `main`).
🔴 Sin verificar en iPhone real: que al elegir una foto HEIC ya **no** salga el error y que el
   análisis devuelva resultado. Validar también una foto en horizontal (orientación EXIF).

### Próximo paso
- Verificar en iPhone real. Si OK, mergear `claude/mobile-photo-upload-error-lztut9` a `main`
  para desplegar en producción (Vercel).

### Decisiones tomadas que no deben revertirse
- La normalización va **en el cliente** (no en el servidor): evita el límite de 4.5 MB de
  Vercel en la subida y resuelve HEIC antes de que llegue al backend.
- `normalizeImage` nunca lanza (devuelve el original ante fallo), igual que
  `detectCatColor`/`getPosition`, para no romper el flujo en navegadores raros.
