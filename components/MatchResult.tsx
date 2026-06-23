'use client'

import type { MatchCandidate } from '@/lib/cats'
import type { MatchStatus } from '@/lib/match-thresholds'

export interface MatchData {
  status: MatchStatus
  detected: boolean
  similarity: number | null
  candidate: MatchCandidate | null
}

interface Props {
  data: MatchData
  previewUrl: string
  busy?: boolean
  onConfirm: () => void // sí, es este gato
  onReject: () => void // no es este -> crear nuevo
  onCreateNew: () => void // gato nuevo -> crear ficha
  onRetry: () => void // otra foto
}

const NEUTERED_LABEL: Record<string, string> = {
  si: 'castrado',
  no: 'sin castrar',
  no_se: 'castración desconocida',
}

export default function MatchResult({
  data,
  previewUrl,
  busy,
  onConfirm,
  onReject,
  onCreateNew,
  onRetry,
}: Props) {
  const pct = data.similarity !== null ? Math.round(data.similarity * 100) : null
  const c = data.candidate

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Foto del gato"
        className="aspect-square w-full rounded-card object-cover"
      />

      {/* Score visible — clave para validar el MVP */}
      <div className="w-full rounded-pill bg-cat-surface px-4 py-2 text-center text-xs text-cat-muted">
        {pct !== null ? `Parecido: ${pct}%` : 'Sin coincidencias por la zona'}
        {!data.detected && ' · no se detectó gato en la foto'}
      </div>

      {data.status === 'registered' && c && (
        <>
          <h2 className="font-display text-xl font-bold">
            Ya registrado: {c.name || 'sin nombre'}
          </h2>
          <CatSummary candidate={c} />
          <p className="text-center text-sm text-cat-muted">¿Es este gato?</p>
          <div className="flex w-full gap-2">
            <button className="btn-primary flex-1" disabled={busy} onClick={onConfirm}>
              Sí, es {c.name || 'este'}
            </button>
            <button className="btn-secondary flex-1" disabled={busy} onClick={onReject}>
              No
            </button>
          </div>
        </>
      )}

      {data.status === 'maybe' && c && (
        <>
          <h2 className="font-display text-xl font-bold">
            ¿Es {c.name || 'este gato'}?
          </h2>
          <CatSummary candidate={c} />
          <div className="flex w-full gap-2">
            <button className="btn-primary flex-1" disabled={busy} onClick={onConfirm}>
              Sí
            </button>
            <button className="btn-secondary flex-1" disabled={busy} onClick={onReject}>
              No, es otro
            </button>
          </div>
        </>
      )}

      {data.status === 'new' && (
        <>
          <h2 className="font-display text-xl font-bold">Gato nuevo</h2>
          <p className="text-center text-sm text-cat-muted">
            No parece estar registrado por aquí.
          </p>
          <button className="btn-primary w-full" disabled={busy} onClick={onCreateNew}>
            Crear ficha
          </button>
        </>
      )}

      <button className="text-sm text-cat-muted underline" disabled={busy} onClick={onRetry}>
        Hacer otra foto
      </button>
    </div>
  )
}

function CatSummary({ candidate }: { candidate: MatchCandidate }) {
  return (
    <div className="w-full rounded-card bg-cat-surface p-4 text-sm">
      <p>
        <span className="text-cat-muted">Castrado:</span>{' '}
        {NEUTERED_LABEL[candidate.neutered]}
        {candidate.ear_tipped && ' (oreja cortada)'}
      </p>
      {candidate.notes && (
        <p className="mt-1">
          <span className="text-cat-muted">Notas:</span> {candidate.notes}
        </p>
      )}
    </div>
  )
}
