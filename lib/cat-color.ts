// Detección del color dominante de un gato a partir de la foto.
// Corre 100% en el navegador del móvil (Canvas API nativa): sin Hugging Face,
// sin servidor, sin coste por foto. Reaprovecha la foto ya hecha.
//
// Limitación honesta: aquí no tenemos el recorte limpio del gato (eso vive en el
// Space), así que miramos sobre todo el CENTRO de la foto para reducir el fondo.
// Es una pista para sugerir un nombre, no un diagnóstico fino del pelaje.

import type { CatColor } from '@/lib/cat-names'

/** Clasifica un píxel RGB en una categoría de color, o null si no es "de gato". */
function classifyPixel(r: number, g: number, b: number): CatColor | null {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const v = max / 255 // brillo
  const s = max === 0 ? 0 : (max - min) / max // saturación

  if (v < 0.22) return 'negro'
  if (s < 0.2) {
    if (v > 0.78) return 'blanco'
    return 'gris'
  }

  // Color saturado → calculamos el tono (hue) en grados.
  const d = max - min
  let h: number
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  if (h < 0) h += 360

  // Tonos cálidos = pelaje naranja/marrón.
  if (h <= 50 || h >= 340) return v > 0.55 ? 'naranja' : 'marron'
  if (h <= 70) return 'naranja' // amarillento → naranja
  // Verdes/azules suelen ser fondo (césped, cielo): los ignoramos.
  return null
}

/** Carga una imagen desde un object URL. */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'))
    img.src = url
  })
}

/**
 * Devuelve el color dominante del gato en la foto.
 * Si hay dos colores fuertes (p. ej. blanco y negro) devuelve 'varios'.
 * Ante cualquier fallo devuelve 'varios' (sugerencia neutra).
 */
export async function detectCatColor(file: Blob): Promise<CatColor> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const size = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'varios'
    ctx.drawImage(img, 0, 0, size, size)

    // Muestreamos solo el centro (60%) para minimizar el fondo.
    const margin = Math.round(size * 0.2)
    const { data } = ctx.getImageData(margin, margin, size - 2 * margin, size - 2 * margin)

    const counts: Record<CatColor, number> = {
      naranja: 0, negro: 0, blanco: 0, gris: 0, marron: 0, varios: 0,
    }
    let total = 0
    for (let i = 0; i < data.length; i += 4) {
      const bucket = classifyPixel(data[i], data[i + 1], data[i + 2])
      if (bucket) {
        counts[bucket]++
        total++
      }
    }
    if (total === 0) return 'varios'

    const ranked = (Object.keys(counts) as CatColor[])
      .map((k) => ({ color: k, share: counts[k] / total }))
      .sort((a, b) => b.share - a.share)

    // Dos colores fuertes → gato de varios colores (tricolor, blanco y negro…).
    if (ranked[1] && ranked[1].share >= 0.3) return 'varios'
    return ranked[0].color
  } catch {
    return 'varios'
  } finally {
    URL.revokeObjectURL(url)
  }
}
