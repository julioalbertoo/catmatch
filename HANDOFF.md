# Handoff — CatMatch

## Sesión — 2026-06-23 (Bloquear ficha sin gato — EN PRODUCCIÓN)

### Qué hemos hecho
- **Bloqueado crear ficha cuando la IA no detecta gato** (`detected === false`).
  En `components/MatchResult.tsx` se añadió una rama temprana: si no hay gato, la
  pantalla de Resultado muestra un estado dedicado ("No hemos detectado ningún gato")
  con un **botón grande "Hacer otra foto"** (→ `onRetry`), sin opciones de
  confirmar/crear. Evita guardar huellas basura de fotos sin gato.
- Subida de versión a **v0.2.2** + entrada en CHANGELOG.
- Verificado `tsc --noEmit` (exit 0). `npm run lint`/`build` fallan solo por el
  entorno (ESLint desactualizado y env vars de Supabase ausentes), no por el cambio.

### Estado actual
🟢 **v0.2.2 en producción** en https://catmatch-one.vercel.app (deploy `dpl_2nxd2j…`,
   target production, READY).
🟡 Falta la **prueba manual** en móvil: foto sin gato → debe verse el nuevo estado +
   botón grande; foto con gato → flujo normal (registered/maybe/new) intacto.
🔴 Calibrar umbrales en `lib/match-thresholds.ts` (0.6 registrado / 0.45 ¿es este?)
   con scores reales de gatos de la calle (pendiente de sesiones previas).

### Próximo paso
- Probar en el móvil una foto **sin gato** y confirmar que aparece "No hemos detectado
  ningún gato" + botón grande, sin opción de crear ficha.

### Decisiones tomadas que no deben revertirse
- El bloqueo es solo de cliente (UI): el flag `detected` ya viaja
  `lib/embed.ts` → `/api/match` → `MatchResult`; basta enforzarlo en la pantalla.
- Cuidado al desplegar: subir el **mismo SHA** a la rama y luego a `main` hace que
  Vercel lo dedupe y solo lo despliegue como *preview*. Subir directo a `main` (o un
  commit nuevo) para que vaya a producción.
- Los commits salen sin firma GPG/SSH (badge "Unverified") pero con autor correcto
  `Claude <noreply@anthropic.com>`; se decidió **no** reescribir historia de `main`
  por un aviso cosmético.
