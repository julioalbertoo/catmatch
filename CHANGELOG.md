# Changelog — CatMatch

## v0.2.4 — 2026-06-24
**commit:** `TBD`
- ui: reducir el espacio entre el pie con la versión y el botón "Hacer foto" (quitado `mt-auto` del footer en la pantalla principal).

---

## v0.2.3 — 2026-06-23
**commit:** `TBD`
- docs: cierre de sesión (HANDOFF). Sin cambios de código.

---

## v0.2.2 — 2026-06-23
**commit:** `TBD`
- fix: bloquear crear ficha cuando la IA no detecta gato en la foto. La pantalla de Resultado muestra ahora un estado dedicado ("No hemos detectado ningún gato") con botón grande "Hacer otra foto", sin opciones de confirmar/crear ficha (evita huellas basura).

---

## v0.2.1 — 2026-06-23
**commit:** `TBD`
- chore: MVP verificado en producción (Vercel) tras añadir las env vars de Supabase + HF_SPACE_URL. El reconocimiento funciona end-to-end. Cierre de sesión.

---

## v0.2.0 — 2026-06-23
**commit:** `TBD`
- feat: MVP del reconocimiento foto→huella→match
  - servicio de inferencia HF Space (`inference/`): FastAPI con YOLOv8n (recorte) + MegaDescriptor-L-384 (embedding 1536-d)
  - Supabase: tablas `cats`/`cat_photos` con pgvector, índice HNSW, RPC `match_cats` (filtro GPS haversine), bucket Storage `cat-photos`, RLS anon
  - rutas API: `/api/match`, `/api/cats` (crear), `/api/cats/[id]` (ver/editar), `/api/cats/[id]/photos` (añadir)
  - libs: `embed.ts`, `cats.ts`, `match-thresholds.ts`, `geo.ts`
  - pantallas: Cámara (flujo 3 pasos + GPS), Resultado (3 estados + score visible), Ficha (ver/editar/añadir foto)

---

## v0.1.0 — 2026-06-23
**commit:** `TBD`
- chore: scaffolding inicial del proyecto — stack Next.js 14 + React 18 + TypeScript + Tailwind 3 + Supabase + Mixpanel (replicando el stack de buythedip)
- docs: CLAUDE.md, HANDOFF.md, BACKLOG.md, CHANGELOG.md y setup de `.claude` (commands + skills)

---
