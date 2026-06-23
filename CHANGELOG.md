# Changelog — CatMatch

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
