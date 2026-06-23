# Handoff — CatMatch

## Sesión inicial — 2026-06-23

### Qué hemos hecho
- Conectado el repo a GitHub (`github.com/julioalbertoo/catmatch`)
- Montado el stack base (igual que buythedip): Next.js 14 (App Router) + React 18 + TypeScript + Tailwind 3 + Supabase + Mixpanel
- Creados CLAUDE.md, BACKLOG.md, CHANGELOG.md, skills y commands (`.claude/`)
- Definido el MVP (3 features) y el modelo de datos previsto

### Estado actual
🟢 Estructura del proyecto y stack definidos
🟡 Falta `npm install` y conectar Supabase (env vars)
🔴 MVP sin implementar

### Próximo paso
Ejecutar `npm install`, crear el proyecto Supabase y rellenar `.env.local`, luego empezar la feature 1 del MVP (capturar gato + GPS).

### Decisiones tomadas que no deben revertirse
- Stack fijo: Next.js + Supabase (+ pgvector) + Tailwind + Mixpanel + GitHub + Vercel
- MVP limitado a 3 features — nada más en v1
- Ubicaciones GPS de los gatos siempre privadas (RLS)
