'use client'

import { useState } from 'react'
import type { Neutered } from '@/lib/cats'

export interface CatFormValues {
  name: string
  neutered: Neutered
  ear_tipped: boolean
  notes: string
}

interface Props {
  initial?: Partial<CatFormValues>
  submitLabel: string
  busy?: boolean
  /** Nombre sugerido por el color del gato: se muestra como placeholder y se
   *  adopta si el usuario deja el campo en blanco. */
  suggestedName?: string
  onSubmit: (values: CatFormValues) => void
}

export default function CatForm({ initial, submitLabel, busy, suggestedName, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? '')
  const [neutered, setNeutered] = useState<Neutered>(initial?.neutered ?? 'no_se')
  const [earTipped, setEarTipped] = useState(initial?.ear_tipped ?? false)
  const [notes, setNotes] = useState(initial?.notes ?? '')

  // Dato clave: oreja cortada => ya está castrado.
  function toggleEarTipped(checked: boolean) {
    setEarTipped(checked)
    if (checked) setNeutered('si')
  }

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        // Si lo deja en blanco, adoptamos el nombre sugerido (placeholder).
        const finalName = name.trim() || (suggestedName ?? '')
        onSubmit({ name: finalName, neutered, ear_tipped: earTipped, notes: notes.trim() })
      }}
    >
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-cat-muted">Nombre</span>
        <input
          className="rounded-card border border-cat-border bg-cat-surface px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={suggestedName || 'Michi'}
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={earTipped}
          onChange={(e) => toggleEarTipped(e.target.checked)}
        />
        <span>Tiene la oreja cortada (ya está castrado)</span>
      </label>

      <fieldset className="flex flex-col gap-1 text-sm">
        <span className="text-cat-muted">Castrado</span>
        <div className="flex gap-2">
          {(['si', 'no', 'no_se'] as Neutered[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setNeutered(v)}
              className={`flex-1 rounded-pill border px-3 py-2 ${
                neutered === v
                  ? 'border-cat-accent bg-cat-accent/10 font-semibold'
                  : 'border-cat-border bg-cat-surface'
              }`}
            >
              {v === 'si' ? 'Sí' : v === 'no' ? 'No' : 'No sé'}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-cat-muted">Notas</span>
        <textarea
          className="min-h-20 rounded-card border border-cat-border bg-cat-surface px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Color, dónde vive, carácter…"
        />
      </label>

      <button className="btn-primary w-full" type="submit" disabled={busy}>
        {busy ? 'Guardando…' : submitLabel}
      </button>
    </form>
  )
}
