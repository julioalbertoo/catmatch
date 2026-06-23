# Handoff — CatMatch

## Sesión — 2026-06-23 (MVP del reconocimiento — EN PRODUCCIÓN)

### Qué hemos hecho
- Construido y desplegado el MVP completo (foto → huella → match → ficha):
  - **Inferencia** (`inference/`): HF Space `https://julioalbertoo-catmatch-inference.hf.space` — FastAPI con YOLOv8n + MegaDescriptor-L-384 (embedding 1536-d).
  - **Supabase**: `cats` + `cat_photos` (pgvector, índice HNSW), RPC `match_cats` con filtro GPS, bucket Storage `cat-photos`, RLS anon (DB compartida).
  - **App** (Next.js): Cámara (3 pasos + GPS), Resultado (registrado / ¿es este? / nuevo + score visible), Ficha (ver/editar/añadir foto). APIs `/api/match` y `/api/cats*`.
- Verificado e2e: mismo gato → 100% "registrado"; gato distinto → 13% "nuevo"; filtro GPS excluye gatos lejanos.
- Resuelto el fallo de deploy en Vercel: faltaban las env vars. Añadidas `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `HF_SPACE_URL`.

### Estado actual
🟢 **MVP en producción y funcionando** en https://catmatch-one.vercel.app (v0.2.1).
🟢 HF Space, Supabase y Vercel conectados; env vars configuradas en los 3 sitios.

### Próximo paso
- Probar en el móvil con gatos reales de la calle y **calibrar umbrales** en `lib/match-thresholds.ts` (ahora 0.6 registrado / 0.45 ¿es este?) con los scores observados.
- Tener en cuenta el cold start del Space gratis (~30-60s la 1ª foto tras inactividad).

### Decisiones tomadas que no deben revertirse
- MVP sin login (DB de gatos compartida); privacidad GPS por RLS → BACKLOG.
- IA en HF Space CPU gratis. Embedding 1536-d (MegaDescriptor-L-384).
