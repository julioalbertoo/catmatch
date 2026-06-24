# Handoff — CatMatch

## Sesión — 2026-06-24 (Subir foto de la galería — botón discreto)

### Qué hemos hecho
- **Permitir subir una foto** además de hacerla con la cámara, con un botón muy discreto:
  - `components/CameraCapture.tsx`: el botón grande "Hacer foto" mantiene `capture="environment"`
    (en móvil abre la cámara). Debajo se añade un **enlace pequeño y discreto** ("o subir una
    foto") con un segundo `<input type="file">` **sin** `capture` → en móvil abre la galería.
  - Ambos inputs comparten el mismo `handleChange` → `onCapture(file)`, así que el flujo de
    análisis/match/formulario **no cambia**. No se tocó `app/page.tsx` ni ninguna API.
  - Estilo discreto reutilizando el patrón de acción secundaria (`text-sm text-cat-muted
    underline`).
- v0.2.12 + entrada en CHANGELOG. `npx tsc --noEmit` pasa limpio.

### Estado actual
🟢 **v0.2.12 en producción** (mergeada a `main` con merge commit `--no-ff` para forzar deploy
   nuevo en Vercel y no deduparlo como *preview*).
🔴 Sin verificar en móvil: que el botón grande abra la cámara y el enlace discreto abra la
   galería, y que al elegir una imagen arranque el análisis igual que con la cámara.
⚠️ `npm run lint` falla por incompatibilidad de opciones de `next lint` con la versión de
   ESLint instalada (pre-existente, no relacionado con este cambio). El check útil (`tsc`) está
   verde.

### Próximo paso
- Verificar en móvil real (cámara vs. galería) y, si OK, mergear a `main` para producción.

### Decisiones tomadas que no deben revertirse
- Dos inputs separados a propósito: uno con `capture="environment"` (cámara) y otro sin
  `capture` (galería). Es la única forma fiable de ofrecer ambas opciones en móvil.
- El enlace de subir es deliberadamente discreto para no competir con el botón principal.
