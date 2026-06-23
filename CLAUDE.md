# CLAUDE.md

> **INSTRUCCIÓN DE INICIO DE SESIÓN**: Al comenzar cualquier sesión nueva: (1) ejecuta `git fetch origin && git status && git log --oneline -5` para verificar que el repo local está sincronizado, (2) lee el archivo HANDOFF.md completo, (3) confirma al usuario el estado actual del proyecto en 2-3 líneas, (4) entra inmediatamente en Plan Mode llamando a la herramienta `EnterPlanMode` — sin esperar a que el usuario lo pida.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CatMatch — Briefing para Claude

## Qué es esto
App para reconocer gatos callejeros por una foto. Fotografías un gato y te dice si ya está registrado (nombre, si está castrado, sus notas) o si es nuevo.

**Cómo funciona:** cada foto se convierte en una "huella" y se compara solo con los gatos de la misma zona (por GPS) → rápido y fiable. La IA sugiere, tú confirmas.

**Para quién:** personas que cuidan gatos de la calle.

**Dato clave:** si tiene la oreja cortada, ya está castrado.

**Privacidad:** las ubicaciones de los gatos quedan protegidas, nunca son públicas.

**Núcleo en una frase:** foto → ¿este gato ya existe por aquí, sí o no?

## MVP — la pregunta que debe responder
**Una sola:** ¿el reconocimiento por foto acierta lo suficiente como para ser útil?
Todo lo que no ayude a contestar eso, fuera. Si esto funciona, lo demás se añade luego.

### Pantallas (solo 3)
1. **Cámara** — botón grande para hacer foto. Pide ubicación (GPS) en silencio por detrás.
2. **Resultado** — según el parecido:
   - "Ya registrado: es Michi" → muestra su ficha. Confirmas: sí / no.
   - "Gato nuevo" → botón para crearle ficha.
   - (Si duda) "¿Es Michi?" → sí / no.
3. **Ficha del gato** — foto, nombre, castrado (sí / no / no sé), notas. Botón "añadir otra foto" (mejora el reconocimiento con el tiempo).

Una lista simple de "mis gatos" es **opcional**. Cualquier otra cosa va al BACKLOG.md.

### Flujo técnico (qué pasa por dentro)
Analogía: como escanear un código de barras, pero la "etiqueta" es la cara del gato.
1. **YOLO** recorta al gato (quita el fondo).
2. **MegaDescriptor** convierte la foto en una huella de números (embedding).
3. **Supabase + pgvector** busca el gato más parecido, filtrando por cercanía GPS.
4. Según el parecido → ya registrado / ¿es este? / nuevo.
5. Confirmas tú, y la foto se suma a su ficha (re-entrena el reconocimiento de ese gato).

## Flujo de trabajo
- Siempre leer HANDOFF.md al inicio de cada sesión
- Siempre actualizar HANDOFF.md al cerrar sin que te lo pidan (`/handoff`), **dejando solo la última sesión completada** (eliminar sesiones anteriores)
- Ante cualquier petición nueva, activar `ready-to-build` primero
- Nunca implementar sin plan aprobado explícitamente (`plan-first`)
- Para ver el estado del proyecto: `/checkpoint`
- Para añadir ideas al backlog: `/backlog`
- Para explicar código o decisiones técnicas: `tech-to-human`
- Tras refactors o cambios grandes, revisar calidad: `/simplify`

## Stack (no cambiar sin preguntar)
- Frontend: Next.js (App Router) + React + TypeScript
- Estilos: Tailwind
- Base de datos + Auth + Storage: Supabase
- Búsqueda por similitud de huellas: Supabase `pgvector` (embeddings de cada foto)
- Analytics: Mixpanel
- Control de versiones: GitHub
- Hosting: Vercel

## Comandos de desarrollo
```bash
npm run dev       # Servidor local en localhost:3000
npm run build     # Build de producción
npm run lint      # Linting con ESLint
```

## Arquitectura prevista

### Páginas (`app/`)
- `app/page.tsx` — pantalla principal: capturar/subir foto del gato
- `app/layout.tsx` — layout raíz (providers, fuentes, metadata)
- `app/match/` — resultado: ¿existe por aquí o es nuevo? (sugerencia de la IA)
- `app/cat/[id]/` — ficha del gato (nombre, castrado, notas)

### API Routes (`app/api/`)
- `app/api/fingerprint/route.ts` — convierte una foto en su huella (embedding)
- `app/api/match/route.ts` — busca gatos similares dentro de la misma zona GPS

### Librerías (`lib/`)
- `lib/supabase.ts` — cliente Supabase (auth + DB + storage)
- `lib/mixpanel.ts` — cliente Mixpanel para analytics
- `lib/version.ts` — constante VERSION (generada desde package.json, NO editar manualmente)

### Modelo de datos (Supabase) — previsto
- `cats` — id, nombre, castrado (bool), oreja_cortada (bool), notas, zona, created_at
- `cat_photos` — id, cat_id, storage_path, embedding (vector), gps_lat, gps_lng, created_at
- Las coordenadas GPS son privadas (RLS estricto) — nunca se exponen públicamente.

## Reglas de oro
1. Muéstrame el plan antes de tocar más de 1 fichero — espera mi OK
2. No instales dependencias nuevas sin explicarme para qué sirven
3. Si algo falla, dímelo — no lo arregles por tu cuenta sin avisarme
4. Si algo no está en el MVP, pregúntame antes de hacerlo
5. Tras cada commit, hacer `git push origin main` automáticamente sin pedir permiso — el usuario siempre prueba en producción

## Regla de privacidad (crítica)
La ubicación de los gatos es sensible. Nunca expongas coordenadas GPS exactas en respuestas públicas, APIs sin auth, ni en el cliente para gatos que no gestiona el usuario. Cualquier cambio que toque GPS o RLS hay que avisarlo explícitamente.

## Regla de versioning
Antes de cada `git commit`, sube la versión en `package.json` incrementando el parche (ej: `0.1.0` → `0.1.1`). `lib/version.ts` se regenera solo en `dev`/`build`.

## Regla de changelog
Antes de cada `git commit`, añade una entrada en `CHANGELOG.md` con número de versión, ID del commit (placeholder `TBD` si hace falta) y resumen breve. Mantén solo las **últimas 10 versiones**.

## Regla de push a main
Tras cada commit, hacer `git push origin main` automáticamente (sin pedir permiso). Siempre indicar la versión subida (ej: "**v0.1.4** en producción").

## Regla de cierre de sesión
Al terminar cualquier sesión de trabajo, actualiza HANDOFF.md automáticamente sin que te lo pida.
