# CatMatch — servicio de inferencia (Hugging Face Space)

Mini-API que convierte una foto de gato en una "huella" (embedding de 1536 números).
Corre en un **Hugging Face Space con CPU gratis**. Es el único sitio donde se
ejecutan los modelos de PyTorch (no caben en Vercel).

## Qué hace
`POST /embed` (multipart, campo `file` = imagen) →
```json
{ "embedding": [ ... 1536 floats ... ], "dim": 1536, "detected": true }
```
1. **YOLOv8n** recorta el gato (si no lo encuentra, usa la foto entera y `detected=false`).
2. **MegaDescriptor-L-384** genera el embedding L2-normalizado.

## Cómo desplegarlo (una vez, ~5-10 min de build)

1. Crea una cuenta gratis en https://huggingface.co
2. Ve a https://huggingface.co/new-space
   - **Owner**: tu usuario
   - **Space name**: `catmatch-inference`
   - **SDK**: **Docker** → "Blank"
   - **Hardware**: CPU basic (gratis)
   - Visibility: Public
3. Sube estos 3 archivos al Space (web "Files → Add file → Upload", o `git push`):
   - `Dockerfile`
   - `app.py`
   - `requirements.txt`
4. El Space construye solo. Cuando ponga **"Running"**, tu URL es:
   `https://<tu-usuario>-catmatch-inference.hf.space`
5. Prueba que vive:
   ```bash
   curl https://<tu-usuario>-catmatch-inference.hf.space/
   # -> {"status":"ok","device":"cpu"}
   ```
6. Pásame esa URL → la pongo en `HF_SPACE_URL` (la app le añade `/embed`).

## Notas
- **Cold start:** tras un rato sin uso el Space "se duerme"; la primera foto tarda
  ~30-60s en despertarlo, luego va fluido. Normal en el plan gratuito.
- Para probar en local: `pip install -r requirements.txt && uvicorn app:app --port 7860`.
