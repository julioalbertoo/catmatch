// Cliente del servicio de inferencia (Hugging Face Space).
// Convierte una imagen en su "huella" (embedding de 1536 floats).

const SPACE_URL = process.env.HF_SPACE_URL

export interface EmbedResult {
  embedding: number[]
  dim: number
  detected: boolean
}

export async function embedImage(file: Blob): Promise<EmbedResult> {
  if (!SPACE_URL) {
    throw new Error('HF_SPACE_URL no está configurada')
  }

  const form = new FormData()
  form.append('file', file, 'cat.jpg')

  const res = await fetch(`${SPACE_URL.replace(/\/$/, '')}/embed`, {
    method: 'POST',
    body: form,
    // El cold start del Space gratis puede tardar; damos margen.
    signal: AbortSignal.timeout(120_000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Inferencia falló (${res.status}): ${text}`)
  }

  const data = (await res.json()) as EmbedResult
  if (!Array.isArray(data.embedding) || data.embedding.length === 0) {
    throw new Error('La inferencia no devolvió un embedding válido')
  }
  return data
}
