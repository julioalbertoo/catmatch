# Handoff — CatMatch

## Sesión — 2026-06-24 (Sugerencia de nombre por color — EN PRODUCCIÓN)

### Qué hemos hecho
- **Sugerencia de nombre de gato según su color** en la pantalla "Nueva ficha" (fuera del
  MVP, hecho a conciencia a petición del usuario):
  - `lib/cat-color.ts`: detecta el color dominante del gato **en el navegador del móvil**
    (Canvas API). Sin Hugging Face, sin coste por foto, sin dependencias nuevas. Muestrea
    el **centro** de la foto para reducir el fondo (no tenemos el recorte limpio del Space).
    Devuelve: naranja / negro / blanco / gris / marrón / varios.
  - `lib/cat-names.ts`: listas de nombres simpáticos por color + `suggestCatName(color)`.
  - `components/CatForm.tsx`: nuevo prop `suggestedName` → se muestra como **placeholder**
    del campo Nombre y se **adopta si el usuario lo deja en blanco** (editable: escribe otro).
  - `app/page.tsx`: al hacer la foto, calcula el color en paralelo (no bloquea el match) y
    pasa el nombre sugerido al formulario, con una pista discreta ("💡 Te proponemos X…").
- v0.2.10 + entrada en CHANGELOG. `tsc --noEmit` pasa limpio.

### Estado actual
🟢 **v0.2.10/v0.2.11 en producción** (mergeado a `main` + commit de redeploy v0.2.11).
   No requiere tocar Hugging Face: todo corre en el cliente (Vercel).
🔴 Sin verificar en móvil: que el nombre sugerido aparece como placeholder, que se adopta
   al dejar el campo en blanco, y la calidad de la detección de color con fotos reales.

### Próximo paso
- Verificar en el móvil el placeholder de nombre y la calidad de la detección de color.
- Si la detección sobre la foto entera sesga demasiado por el fondo, valorar la "Opción B"
  (descripción con modelo de visión) — implicaría tocar el Space (`inference/`).

### Decisiones tomadas que no deben revertirse
- La detección de color es **client-side a propósito** para no tocar Hugging Face. El Space
  (`inference/`) no se actualiza desde GitHub: hay que subirlo a mano en huggingface.co.
- El nombre va en el **placeholder** (no como valor pre-rellenado), pero se adopta como
  nombre real si el campo se deja vacío — así "aceptar" no obliga a borrar nada.
- Cuidado al desplegar: subir el **mismo SHA** a una rama y luego a `main` hace que Vercel
  lo dedupe como *preview*. Subir un **commit nuevo** a `main` para que vaya a producción.
