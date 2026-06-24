// Sugerencia de nombre simpático según el color dominante del gato.
// Fuera del MVP — ayuda al usuario a rellenar el nombre, no es obligatorio.

export type CatColor = 'naranja' | 'negro' | 'blanco' | 'gris' | 'marron' | 'varios'

const NAMES: Record<CatColor, string[]> = {
  naranja: ['Naranjito', 'Zanahoria', 'Calabaza', 'Mandarina', 'Cheeto', 'Rubio', 'Tigre'],
  negro: ['Carbón', 'Sombra', 'Pantera', 'Onyx', 'Regaliz', 'Noche', 'Brujo'],
  blanco: ['Copito', 'Nube', 'Coco', 'Marfil', 'Algodón', 'Yuki', 'Perla'],
  gris: ['Ceniza', 'Plata', 'Humo', 'Niebla', 'Topo', 'Gris', 'Pelusa'],
  marron: ['Canela', 'Galleta', 'Chocolate', 'Café', 'Nuez', 'Trufa', 'Caramelo'],
  varios: ['Manchas', 'Arlequín', 'Mosaico', 'Pinto', 'Calcetines', 'Confeti', 'Pícaro'],
}

/** Devuelve un nombre al azar de la lista del color indicado. */
export function suggestCatName(color: CatColor): string {
  const list = NAMES[color] ?? NAMES.varios
  return list[Math.floor(Math.random() * list.length)]
}
