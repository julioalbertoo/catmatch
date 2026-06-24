// Captura silenciosa de la ubicación (cliente). Nunca lanza:
// si el usuario deniega o no hay GPS, devuelve null.

export interface Coords {
  lat: number
  lng: number
}

export function getPosition(timeoutMs = 8000): Promise<Coords | null> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 }
    )
  })
}

// Estado del permiso de ubicación (Permissions API). Mismo enfoque defensivo
// que getPosition: nunca lanza. Si el API no existe (Safari antiguo), devuelve
// 'pending' para mostrar el aviso informativo por defecto.
export type GeoPermission = 'pending' | 'granted' | 'denied'

export async function getGeoPermission(): Promise<GeoPermission> {
  if (typeof navigator === 'undefined' || !navigator.permissions) return 'pending'
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' })
    return status.state === 'granted'
      ? 'granted'
      : status.state === 'denied'
        ? 'denied'
        : 'pending'
  } catch {
    return 'pending'
  }
}

// Igual que getGeoPermission pero, cuando el API lo soporta, llama a onChange
// cada vez que cambia el permiso (p. ej. al concederlo) para refrescar la UI
// sin recargar. Devuelve una función de limpieza.
export function watchGeoPermission(
  onChange: (state: GeoPermission) => void
): () => void {
  if (typeof navigator === 'undefined' || !navigator.permissions) {
    onChange('pending')
    return () => {}
  }
  let status: PermissionStatus | null = null
  const handle = () => {
    if (!status) return
    onChange(
      status.state === 'granted'
        ? 'granted'
        : status.state === 'denied'
          ? 'denied'
          : 'pending'
    )
  }
  navigator.permissions
    .query({ name: 'geolocation' })
    .then((s) => {
      status = s
      handle()
      status.addEventListener('change', handle)
    })
    .catch(() => onChange('pending'))

  return () => {
    status?.removeEventListener('change', handle)
  }
}
