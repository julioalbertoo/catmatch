// Helpers de datos de gatos sobre Supabase (DB + Storage).
// MVP sin login: usa la clave anon (las policies dan acceso total).

import { supabase } from '@/lib/supabase'
import { MATCH_RADIUS_M } from '@/lib/match-thresholds'

const BUCKET = 'cat-photos'

export type Neutered = 'si' | 'no' | 'no_se'

export interface Cat {
  id: string
  name: string | null
  neutered: Neutered
  ear_tipped: boolean
  notes: string | null
  created_at: string
}

export interface CatPhoto {
  id: string
  cat_id: string
  storage_path: string
  lat: number | null
  lng: number | null
  created_at: string
}

export interface MatchCandidate {
  cat_id: string
  name: string | null
  neutered: Neutered
  ear_tipped: boolean
  notes: string | null
  similarity: number
  photo_count: number
}

/** Busca los gatos más parecidos dentro del radio GPS. */
export async function matchCats(
  embedding: number[],
  lat: number | null,
  lng: number | null
): Promise<MatchCandidate[]> {
  const { data, error } = await supabase.rpc('match_cats', {
    // pgvector espera el vector en formato texto '[v1,v2,...]'
    query_embedding: JSON.stringify(embedding),
    q_lat: lat,
    q_lng: lng,
    radius_m: MATCH_RADIUS_M,
  })
  if (error) throw new Error(`match_cats: ${error.message}`)
  return (data ?? []) as MatchCandidate[]
}

/** Sube una foto al Storage y devuelve su ruta. */
async function uploadPhoto(catId: string, photoId: string, file: Blob) {
  const path = `${catId}/${photoId}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: 'image/jpeg', upsert: true })
  if (error) throw new Error(`upload: ${error.message}`)
  return path
}

/** URL pública de una foto. */
export function photoUrl(storagePath: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

interface NewCatInput {
  name: string | null
  neutered: Neutered
  ear_tipped: boolean
  notes: string | null
  embedding: number[]
  lat: number | null
  lng: number | null
  file: Blob
}

/** Crea un gato nuevo con su primera foto. */
export async function createCat(input: NewCatInput): Promise<Cat> {
  const { data: cat, error } = await supabase
    .from('cats')
    .insert({
      name: input.name,
      neutered: input.neutered,
      ear_tipped: input.ear_tipped,
      notes: input.notes,
    })
    .select()
    .single()
  if (error) throw new Error(`createCat: ${error.message}`)

  await addPhoto(cat.id, {
    embedding: input.embedding,
    lat: input.lat,
    lng: input.lng,
    file: input.file,
  })
  return cat as Cat
}

interface NewPhotoInput {
  embedding: number[]
  lat: number | null
  lng: number | null
  file: Blob
}

/** Añade una foto (y su huella) a un gato existente. */
export async function addPhoto(catId: string, input: NewPhotoInput): Promise<CatPhoto> {
  const { data: photo, error } = await supabase
    .from('cat_photos')
    .insert({
      cat_id: catId,
      storage_path: 'pending',
      // pgvector espera el vector en formato texto '[v1,v2,...]'
      embedding: JSON.stringify(input.embedding),
      lat: input.lat,
      lng: input.lng,
    })
    .select()
    .single()
  if (error) throw new Error(`addPhoto: ${error.message}`)

  const path = await uploadPhoto(catId, photo.id, input.file)
  const { error: updErr } = await supabase
    .from('cat_photos')
    .update({ storage_path: path })
    .eq('id', photo.id)
  if (updErr) throw new Error(`addPhoto/path: ${updErr.message}`)

  return { ...photo, storage_path: path } as CatPhoto
}

/** Ficha de un gato con sus fotos. */
export async function getCat(
  catId: string
): Promise<{ cat: Cat; photos: CatPhoto[] } | null> {
  const { data: cat, error } = await supabase
    .from('cats')
    .select()
    .eq('id', catId)
    .maybeSingle()
  if (error) throw new Error(`getCat: ${error.message}`)
  if (!cat) return null

  const { data: photos, error: pErr } = await supabase
    .from('cat_photos')
    .select('id, cat_id, storage_path, lat, lng, created_at')
    .eq('cat_id', catId)
    .order('created_at', { ascending: false })
  if (pErr) throw new Error(`getCat/photos: ${pErr.message}`)

  return { cat: cat as Cat, photos: (photos ?? []) as CatPhoto[] }
}

interface UpdateCatInput {
  name?: string | null
  neutered?: Neutered
  ear_tipped?: boolean
  notes?: string | null
}

/** Actualiza los datos de la ficha. */
export async function updateCat(catId: string, input: UpdateCatInput): Promise<Cat> {
  const { data, error } = await supabase
    .from('cats')
    .update(input)
    .eq('id', catId)
    .select()
    .single()
  if (error) throw new Error(`updateCat: ${error.message}`)
  return data as Cat
}
