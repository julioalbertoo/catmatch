// Normaliza la foto en el propio móvil antes de subirla.
// Las fotos de iPhone son HEIC y grandes (3–5 MB); el resto del pipeline asume
// JPEG y Vercel rechaza cuerpos > ~4.5 MB. Aquí decodificamos → reescalamos →
// re-codificamos a un JPEG pequeño, lo que también respeta la orientación EXIF.
//
// Defensivo: ante cualquier fallo devuelve el archivo original (nunca lanza),
// igual que detectCatColor/getPosition.

const MAX_SIDE = 1600
const JPEG_QUALITY = 0.85

/** Decodifica un archivo de imagen respetando la orientación EXIF. */
async function decode(file: Blob): Promise<CanvasImageSource & { width: number; height: number }> {
  // Vía moderna: maneja HEIC en Safari y la orientación EXIF de iPhone.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Algunos navegadores no soportan las opciones → caemos al fallback.
    }
  }
  // Fallback con <img> + object URL (mismo patrón que loadImage en cat-color.ts).
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('No se pudo cargar la imagen'))
      el.src = url
    })
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * Devuelve un JPEG reescalado (máx. 1600 px de lado) listo para subir.
 * Si algo falla, devuelve el archivo original sin tocar.
 */
export async function normalizeImage(file: File): Promise<File> {
  try {
    const source = await decode(file)
    const sw = source.width
    const sh = source.height
    if (!sw || !sh) return file

    const scale = Math.min(1, MAX_SIDE / Math.max(sw, sh))
    const w = Math.round(sw * scale)
    const h = Math.round(sh * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(source, 0, 0, w, h)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    )
    if (!blob) return file

    return new File([blob], 'cat.jpg', { type: 'image/jpeg' })
  } catch {
    return file
  }
}
