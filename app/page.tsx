'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CameraCapture from '@/components/CameraCapture'
import MatchResult, { type MatchData } from '@/components/MatchResult'
import CatForm, { type CatFormValues } from '@/components/CatForm'
import { getPosition, type Coords } from '@/lib/geo'
import { VERSION } from '@/lib/version'

type Step = 'camera' | 'analyzing' | 'result' | 'form'

interface MatchResponse extends MatchData {
  embedding: number[]
}

export default function Home() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('camera')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileRef = useRef<File | null>(null)
  const coordsRef = useRef<Coords | null>(null)
  const matchRef = useRef<MatchResponse | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const reset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    fileRef.current = null
    coordsRef.current = null
    matchRef.current = null
    setPreviewUrl('')
    setError(null)
    setStep('camera')
  }, [previewUrl])

  const handleCapture = useCallback(async (file: File) => {
    setError(null)
    fileRef.current = file
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setStep('analyzing')

    try {
      const coords = await getPosition()
      coordsRef.current = coords

      const form = new FormData()
      form.append('file', file)
      if (coords) {
        form.append('lat', String(coords.lat))
        form.append('lng', String(coords.lng))
      }

      const res = await fetch('/api/match', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error analizando la foto')

      matchRef.current = data as MatchResponse
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setStep('camera')
    }
  }, [])

  // Añade la foto a un gato existente y abre su ficha.
  const confirmExisting = useCallback(async () => {
    const match = matchRef.current
    const file = fileRef.current
    if (!match?.candidate || !file) return
    setBusy(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('embedding', JSON.stringify(match.embedding))
      const coords = coordsRef.current
      if (coords) {
        form.append('lat', String(coords.lat))
        form.append('lng', String(coords.lng))
      }
      const res = await fetch(`/api/cats/${match.candidate.cat_id}/photos`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo añadir la foto')
      router.push(`/cat/${match.candidate.cat_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setBusy(false)
    }
  }, [router])

  // Crea un gato nuevo con la foto + datos del formulario.
  const createNew = useCallback(
    async (values: CatFormValues) => {
      const match = matchRef.current
      const file = fileRef.current
      if (!match || !file) return
      setBusy(true)
      setError(null)
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('embedding', JSON.stringify(match.embedding))
        form.append('name', values.name)
        form.append('neutered', values.neutered)
        form.append('ear_tipped', String(values.ear_tipped))
        form.append('notes', values.notes)
        const coords = coordsRef.current
        if (coords) {
          form.append('lat', String(coords.lat))
          form.append('lng', String(coords.lng))
        }
        const res = await fetch('/api/cats', { method: 'POST', body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo crear el gato')
        router.push(`/cat/${data.cat.id}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setBusy(false)
      }
    },
    [router]
  )

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center gap-6 p-6">
      <header className="flex items-center gap-2 pt-4">
        <span className="text-3xl" role="img" aria-label="gato">
          🐱
        </span>
        <h1 className="font-display text-2xl font-bold">CatMatch</h1>
      </header>

      {error && (
        <p className="w-full max-w-xs rounded-card bg-cat-danger/10 px-4 py-2 text-center text-sm text-cat-danger">
          {error}
        </p>
      )}

      {step === 'camera' && (
        <>
          <p className="text-center text-cat-muted">
            Fotografía un gato callejero para saber si ya está registrado por la zona.
          </p>
          <CameraCapture onCapture={handleCapture} />
        </>
      )}

      {step === 'analyzing' && (
        <div className="flex flex-col items-center gap-4 pt-10 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Foto del gato"
              className="aspect-square w-48 rounded-card object-cover opacity-70"
            />
          )}
          <p className="text-cat-muted">Analizando la foto…</p>
          <p className="text-xs text-cat-muted">
            La primera vez puede tardar ~1 min (el servidor de IA se despierta).
          </p>
        </div>
      )}

      {step === 'result' && matchRef.current && (
        <MatchResult
          data={matchRef.current}
          previewUrl={previewUrl}
          busy={busy}
          onConfirm={confirmExisting}
          onReject={() => setStep('form')}
          onCreateNew={() => setStep('form')}
          onRetry={reset}
        />
      )}

      {step === 'form' && (
        <>
          <h2 className="font-display text-xl font-bold">Nueva ficha</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Foto del gato"
              className="aspect-square w-40 rounded-card object-cover"
            />
          )}
          <CatForm submitLabel="Crear gato" busy={busy} onSubmit={createNew} />
          <button className="text-sm text-cat-muted underline" onClick={reset}>
            Cancelar
          </button>
        </>
      )}

      <footer className="text-xs text-cat-muted">{VERSION}</footer>
    </main>
  )
}
