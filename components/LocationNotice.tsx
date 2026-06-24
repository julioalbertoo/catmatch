'use client'

import { useEffect, useState } from 'react'
import { watchGeoPermission, type GeoPermission } from '@/lib/geo'

// Aviso en la pantalla de cámara sobre el permiso de ubicación.
// - 'granted'  → no muestra nada (ya está concedido).
// - 'pending'  → avisa de que se pedirá la ubicación y para qué sirve.
// - 'denied'   → recuerda, en tono suave, que sin ubicación es menos fiable.
export default function LocationNotice() {
  const [perm, setPerm] = useState<GeoPermission>('granted')

  useEffect(() => {
    // Empieza en 'granted' para no parpadear el aviso antes de conocer el estado.
    return watchGeoPermission(setPerm)
  }, [])

  if (perm === 'granted') return null

  if (perm === 'denied') {
    return (
      <p className="w-full max-w-xs rounded-card bg-cat-danger/10 px-4 py-2 text-center text-sm text-cat-danger">
        📍 Sin tu ubicación la identificación es menos fiable. Puedes activarla en
        los ajustes del navegador.
      </p>
    )
  }

  return (
    <p className="w-full max-w-xs rounded-card bg-cat-surface px-4 py-2 text-center text-sm text-cat-muted">
      📍 Te pediremos tu ubicación para identificar al gato con más fiabilidad:
      solo lo comparamos con gatos de tu zona. Tu ubicación se guarda en privado
      y nunca se muestra públicamente, para proteger al gato.
    </p>
  )
}
