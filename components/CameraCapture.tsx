'use client'

interface Props {
  onCapture: (file: File) => void
  disabled?: boolean
}

// Botón grande para hacer foto (cámara) + enlace discreto para subir una de la galería.
export default function CameraCapture({ onCapture, disabled }: Props) {
  // Mismo manejo para ambos inputs: dispara onCapture y permite repetir la misma foto.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onCapture(file)
    e.target.value = '' // permite repetir la misma foto
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      {/* Botón grande: en móvil abre la cámara directamente. */}
      <label
        className={`flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-cat-border bg-cat-surface text-cat-muted transition active:scale-95 ${
          disabled ? 'pointer-events-none opacity-50' : 'hover:border-cat-accent'
        }`}
      >
        <span className="text-6xl" role="img" aria-label="cámara">
          📷
        </span>
        <span className="font-display text-lg font-semibold text-cat-text">
          Hacer foto
        </span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={disabled}
          onChange={handleChange}
        />
      </label>

      {/* Enlace discreto: sin "capture" → en móvil abre la galería. */}
      <label
        className={`cursor-pointer text-sm text-cat-muted underline ${
          disabled ? 'pointer-events-none opacity-50' : 'hover:text-cat-text'
        }`}
      >
        o subir una foto
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled}
          onChange={handleChange}
        />
      </label>
    </div>
  )
}
