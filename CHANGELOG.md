# Changelog — CatMatch

## v0.2.12 — 2026-06-24
**commit:** `TBD`
- feat: permitir subir una foto de la galería además de hacerla con la cámara. El botón grande "Hacer foto" sigue abriendo la cámara en móvil; debajo, un enlace discreto ("o subir una foto") usa un input sin `capture` para abrir la galería (`components/CameraCapture.tsx`). Ambos comparten el mismo flujo de análisis.

---

## v0.2.11 — 2026-06-24
**commit:** `TBD`
- chore: redeploy a producción de la sugerencia de nombre por color (v0.2.10) + cierre de sesión. Sin cambios de código.

---

## v0.2.10 — 2026-06-24
**commit:** `TBD`
- feat: sugerencia de nombre por color del gato en "Nueva ficha". Al hacer la foto, el móvil detecta el color dominante en el navegador (Canvas API, sin Hugging Face ni coste por foto) y propone un nombre simpático (`lib/cat-color.ts` + `lib/cat-names.ts`). El nombre aparece como placeholder del campo Nombre y se adopta si el usuario lo deja en blanco; puede escribir otro. Limitación conocida: sin el recorte del Space, el color se mide sobre el centro de la foto (puede sesgar con el fondo).

---

## v0.2.9 — 2026-06-24
**commit:** `TBD`
- docs: cierre de sesión (HANDOFF) + push de v0.2.8 a producción. Sin cambios de código.

---

## v0.2.8 — 2026-06-24
**commit:** `TBD`
- ui: mensaje de privacidad de ubicación en dos momentos. Al pedir el permiso GPS (`components/LocationNotice.tsx`) se aclara que la ubicación se guarda en privado y nunca se muestra públicamente, para proteger al gato. Al registrar un gato nuevo ("Nueva ficha" en `app/page.tsx`) se añade la misma nota de tranquilidad. Solo copy, sin cambios de lógica.

---

## v0.2.7 — 2026-06-24
**commit:** `TBD`
- chore: redeploy a producción del aviso de ubicación (v0.2.6) + cierre de sesión. Sin cambios de código.

---

## v0.2.6 — 2026-06-24
**commit:** `TBD`
- ui: aviso de ubicación en la pantalla de cámara. Aparece solo si el permiso GPS está pendiente ("Te pediremos tu ubicación para identificar al gato con más fiabilidad"), desaparece al concederlo y cambia a un mensaje suave si está denegado. Nuevo `components/LocationNotice.tsx` + helpers `getGeoPermission`/`watchGeoPermission` en `lib/geo.ts`.

---

## v0.2.5 — 2026-06-24
**commit:** `TBD`
- docs: cierre de sesión (HANDOFF). Sin cambios de código.

---

## v0.2.4 — 2026-06-24
**commit:** `TBD`
- ui: reducir el espacio entre el pie con la versión y el botón "Hacer foto" (quitado `mt-auto` del footer en la pantalla principal).

---

## v0.2.3 — 2026-06-23
**commit:** `TBD`
- docs: cierre de sesión (HANDOFF). Sin cambios de código.

---

## v0.2.2 — 2026-06-23
**commit:** `TBD`
- fix: bloquear crear ficha cuando la IA no detecta gato en la foto. La pantalla de Resultado muestra ahora un estado dedicado ("No hemos detectado ningún gato") con botón grande "Hacer otra foto", sin opciones de confirmar/crear ficha (evita huellas basura).

---


