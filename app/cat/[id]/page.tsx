'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import CatForm, { type CatFormValues } from '@/components/CatForm'
import CameraCapture from '@/components/CameraCapture'
import { photoUrl, type Cat, type CatPhoto } from '@/lib/cats'
import { getPosition } from '@/lib/geo'

const NEUTERED_LABEL: Record<string, string> = {
  si: 'Castrado',
  no: 'Sin castrar',
  no_se: 'No se sabe',
}

export default function CatPage() {
  const { id } = useParams<{ id: string }>()
  const [cat, setCat] = useState<Cat | null>(null)
  const [photos, setPhotos] = useState<CatPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch(`/api/cats/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No encontrado')
      setCat(data.cat)
      setPhotos(data.photos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const saveEdits = useCallback(
    async (values: CatFormValues) => {
      setBusy(true)
      setError(null)
      try {
        const res = await fetch(`/api/cats/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo guardar')
        setCat(data.cat)
        setEditing(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setBusy(false)
      }
    },
    [id]
  )

  // Añade otra foto: primero saca la huella (vía /api/match), luego la guarda.
  const addPhoto = useCallback(
    async (file: File) => {
      setBusy(true)
      setError(null)
      try {
        const coords = await getPosition()
        const embedForm = new FormData()
        embedForm.append('file', file)
        if (coords) {
          embedForm.append('lat', String(coords.lat))
          embedForm.append('lng', String(coords.lng))
        }
        const embedRes = await fetch('/api/match', { method: 'POST', body: embedForm })
        const embedData = await embedRes.json()
        if (!embedRes.ok) throw new Error(embedData.error || 'Error con la foto')

        const form = new FormData()
        form.append('file', file)
        form.append('embedding', JSON.stringify(embedData.embedding))
        if (coords) {
          form.append('lat', String(coords.lat))
          form.append('lng', String(coords.lng))
        }
        const res = await fetch(`/api/cats/${id}/photos`, { method: 'POST', body: form })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'No se pudo añadir la foto')
        await load()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setBusy(false)
      }
    },
    [id, load]
  )

  if (loading) {
    return <main className="p-6 text-center text-cat-muted">Cargando…</main>
  }

  if (!cat) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-4 p-6 text-center">
        <p className="text-cat-danger">{error || 'Gato no encontrado'}</p>
        <Link href="/" className="btn-primary">
          Volver
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-5 p-6">
      <Link href="/" className="text-sm text-cat-muted underline">
        ← Otra foto
      </Link>

      {error && (
        <p className="rounded-card bg-cat-danger/10 px-4 py-2 text-center text-sm text-cat-danger">
          {error}
        </p>
      )}

      {photos[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl(photos[0].storage_path)}
          alt={cat.name || 'Gato'}
          className="aspect-square w-full rounded-card object-cover"
        />
      )}

      {editing ? (
        <CatForm
          initial={{
            name: cat.name ?? '',
            neutered: cat.neutered,
            ear_tipped: cat.ear_tipped,
            notes: cat.notes ?? '',
          }}
          submitLabel="Guardar"
          busy={busy}
          onSubmit={saveEdits}
        />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">
              {cat.name || 'Gato sin nombre'}
            </h1>
            <button className="text-sm text-cat-accent underline" onClick={() => setEditing(true)}>
              Editar
            </button>
          </div>
          <div className="rounded-card bg-cat-surface p-4 text-sm">
            <p>
              <span className="text-cat-muted">Castrado:</span> {NEUTERED_LABEL[cat.neutered]}
              {cat.ear_tipped && ' · oreja cortada'}
            </p>
            {cat.notes && (
              <p className="mt-2">
                <span className="text-cat-muted">Notas:</span> {cat.notes}
              </p>
            )}
          </div>
        </>
      )}

      {photos.length > 1 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.slice(1).map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.id}
              src={photoUrl(p.storage_path)}
              alt="Foto"
              className="aspect-square w-full rounded-card object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-col items-center gap-2">
        <p className="text-sm text-cat-muted">
          Añade otra foto para que lo reconozca mejor ({photos.length} foto
          {photos.length === 1 ? '' : 's'})
        </p>
        <CameraCapture onCapture={addPhoto} disabled={busy} />
      </div>
    </main>
  )
}
