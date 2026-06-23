'use client'

interface Props {
  onCapture: (file: File) => void
  disabled?: boolean
}

// Botón grande para hacer/elegir foto. En móvil abre la cámara directamente.
export default function CameraCapture({ onCapture, disabled }: Props) {
  return (
    <label
      className={`flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed border-cat-border bg-cat-surface text-cat-muted transition active:scale-95 ${
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
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onCapture(file)
          e.target.value = '' // permite repetir la misma foto
        }}
      />
    </label>
  )
}
