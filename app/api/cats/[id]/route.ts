import { NextRequest, NextResponse } from 'next/server'
import { getCat, updateCat, type Neutered } from '@/lib/cats'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getCat(params.id)
    if (!result) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const neutered = ['si', 'no', 'no_se'].includes(body.neutered)
      ? (body.neutered as Neutered)
      : undefined
    const cat = await updateCat(params.id, {
      name: body.name,
      neutered,
      ear_tipped: body.ear_tipped,
      notes: body.notes,
    })
    return NextResponse.json({ cat })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
