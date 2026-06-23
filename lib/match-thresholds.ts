// Umbrales de decisión del reconocimiento (similitud coseno, 0..1).
// Provisionales: se calibran con los scores reales observados en el MVP.
//
//   similarity >= REGISTERED  -> "ya registrado" (mismo gato, confianza alta)
//   MAYBE..REGISTERED         -> "¿es este?" (sugerencia a confirmar)
//   < MAYBE                   -> "gato nuevo"

export const SIMILARITY_REGISTERED = 0.6
export const SIMILARITY_MAYBE = 0.45

// Radio de búsqueda por cercanía GPS, en metros.
export const MATCH_RADIUS_M = 1000

export type MatchStatus = 'registered' | 'maybe' | 'new'

export function classify(similarity: number | null): MatchStatus {
  if (similarity === null) return 'new'
  if (similarity >= SIMILARITY_REGISTERED) return 'registered'
  if (similarity >= SIMILARITY_MAYBE) return 'maybe'
  return 'new'
}
