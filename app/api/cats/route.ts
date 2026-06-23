import { NextRequest, NextResponse } from 'next/server'
import { createCat, type Neutered } from '@/lib/cats'

export const runtime = 'nodejs'

function parseCoord(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function parseNeutered(value: FormDataEntryValue | null): Neutered {
  return value === 'si' || value === 'no' ? value : 'no_se'
}

// Crea un gato nuevo con su primera foto. Reutiliza el embedding ya calculado
// por /api/match (se pasa como JSON en el campo "embedding").
export async function POST(req: NextRequest) {
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

    const cat = await createCat({
      name: (form.get('name') as string) || null,
      neutered: parseNeutered(form.get('neutered')),
      ear_tipped: form.get('ear_tipped') === 'true',
      notes: (form.get('notes') as string) || null,
      embedding,
      lat: parseCoord(form.get('lat')),
      lng: parseCoord(form.get('lng')),
      file,
    })

    return NextResponse.json({ cat }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
