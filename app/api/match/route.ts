import { NextRequest, NextResponse } from 'next/server'
import { embedImage } from '@/lib/embed'
import { matchCats } from '@/lib/cats'
import { classify } from '@/lib/match-thresholds'

export const runtime = 'nodejs'
export const maxDuration = 300

function parseCoord(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: 'Falta la imagen' }, { status: 400 })
    }
    const lat = parseCoord(form.get('lat'))
    const lng = parseCoord(form.get('lng'))

    const { embedding, detected } = await embedImage(file)
    const candidates = await matchCats(embedding, lat, lng)
    const best = candidates[0] ?? null
    const status = classify(best?.similarity ?? null)

    return NextResponse.json({
      status,
      detected,
      similarity: best?.similarity ?? null,
      candidate: status === 'new' ? null : best,
      candidates,
      embedding,
      lat,
      lng,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
