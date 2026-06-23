# Handoff — CatMatch

## Sesión — 2026-06-23 (MVP del reconocimiento)

### Qué hemos hecho
- Construido el MVP completo (foto → huella → match → ficha), v0.2.0:
  - **Inferencia** (`inference/`): HF Space con FastAPI, YOLOv8n + MegaDescriptor-L-384 (embedding 1536-d).
  - **Supabase**: `cats` + `cat_photos` (pgvector, índice HNSW), RPC `match_cats` con filtro GPS, bucket Storage `cat-photos`, RLS anon (DB compartida).
  - **App** (Next.js): pantalla Cámara (3 pasos + GPS), Resultado (registrado / ¿es este? / nuevo + score visible), Ficha (ver/editar/añadir foto). Rutas API `/api/match` y `/api/cats*`.
- Build de producción OK.

### Estado actual
🟢 Código del MVP terminado y compilando · pusheado a main (deploy auto en Vercel)
🔴 **BLOQUEANTE para probar:** falta desplegar el HF Space y configurar `HF_SPACE_URL` (local y en Vercel). Sin eso, `/api/match` falla.

### Próximo paso
1. Crear el HF Space gratis (ver `inference/README.md`) y copiar su URL.
2. Poner `HF_SPACE_URL` en `.env.local` y en Vercel (Settings → Environment Variables) → redeploy.
3. Prueba end-to-end: foto de un gato → "nuevo" → crear ficha; segunda foto del mismo gato → debe reconocerlo; anotar scores y **calibrar umbrales** en `lib/match-thresholds.ts`.

### Decisiones tomadas que no deben revertirse
- MVP sin login (DB de gatos compartida); privacidad GPS por RLS → BACKLOG.
- IA en HF Space CPU gratis (cold start ~1 min asumido).
- Embedding 1536-d (MegaDescriptor-L-384). Umbrales coseno provisionales: 0.6 registrado / 0.45 ¿es este?.
