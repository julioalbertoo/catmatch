import { VERSION } from '@/lib/version'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <span className="text-5xl" role="img" aria-label="gato">🐱</span>
      <h1 className="font-display text-3xl font-bold">CatMatch</h1>
      <p className="text-cat-muted">
        Fotografía un gato callejero y descubre si ya está registrado por la zona
        o si es nuevo.
      </p>
      <p className="text-xs text-cat-muted">{VERSION}</p>
    </main>
  )
}
