import { NextRequest, NextResponse } from 'next/server'
import { addPhoto } from '@/lib/cats'

export const runtime = 'nodejs'

function parseCoord(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

// Añade una foto a un gato existente (al confirmar un match o desde la ficha).
// Reutiliza el embedding de /api/match si viene; si no, no se puede (debe venir).
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    const embeddingRaw = form.get('embedding')
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Falta la imagen' }, { status: 400 })
    }
    if (typeof embeddingRaw !== 'string') {
      return NextResponse.json({ error: 'Falta el embedding' }, { status: 400 })
    }
    const embedding = JSON.parse(embeddingRaw) as number[]

    const photo = await addPhoto(params.id, {
      embedding,
      lat: parseCoord(form.get('lat')),
      lng: parseCoord(form.get('lng')),
      file,
    })
    return NextResponse.json({ photo }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
