# CatMatch 🐱

App para reconocer gatos callejeros por una foto.

Fotografías un gato y te dice si ya está registrado (nombre, si está castrado,
sus notas) o si es nuevo. Cada foto se convierte en una "huella" y se compara
solo con los gatos de la misma zona (por GPS). La IA sugiere, tú confirmas.

**Núcleo en una frase:** foto → ¿este gato ya existe por aquí, sí o no?

## Stack
Next.js 14 (App Router) · React 18 · TypeScript · Tailwind · Supabase (+ pgvector) · Mixpanel · Vercel

## Desarrollo
```bash
npm install
cp .env.local.example .env.local   # rellena las claves de Supabase
npm run dev                         # http://localhost:3000
```

Más contexto en [CLAUDE.md](CLAUDE.md) y estado actual en [HANDOFF.md](HANDOFF.md).
