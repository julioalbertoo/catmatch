"""
CatMatch — servicio de inferencia.

POST /embed  (multipart: file=imagen)
  1. YOLOv8n detecta y recorta el gato de mayor confianza (clase COCO 'cat').
     Si no detecta gato, usa la imagen completa y devuelve detected=false.
  2. MegaDescriptor-L-384 (Swin-L) genera un embedding L2-normalizado (1536-d).
  -> { "embedding": [...float...], "dim": 1536, "detected": bool }

Pensado para correr en un Hugging Face Space (CPU básico, gratis).
"""

import io

import numpy as np
import timm
import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image
from torchvision import transforms
from ultralytics import YOLO

app = FastAPI(title="CatMatch inference")

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
COCO_CAT_CLASS = 15  # índice de "cat" en COCO

# --- Carga de modelos (una sola vez al arrancar) ---
detector = YOLO("yolov8n.pt")  # se descarga solo la primera vez

descriptor = timm.create_model(
    "hf-hub:BVRA/MegaDescriptor-L-384", pretrained=True, num_classes=0
)
descriptor = descriptor.to(DEVICE).eval()

transform = transforms.Compose(
    [
        transforms.Resize((384, 384)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5]),
    ]
)


def crop_cat(img: Image.Image) -> tuple[Image.Image, bool]:
    """Recorta el gato de mayor confianza. Si no hay, devuelve la imagen entera."""
    results = detector.predict(img, classes=[COCO_CAT_CLASS], verbose=False)
    best = None
    best_conf = 0.0
    for r in results:
        for box in r.boxes:
            conf = float(box.conf[0])
            if conf > best_conf:
                best_conf = conf
                best = box.xyxy[0].tolist()
    if best is None:
        return img, False
    x1, y1, x2, y2 = (int(v) for v in best)
    return img.crop((x1, y1, x2, y2)), True


@torch.inference_mode()
def embed(img: Image.Image) -> list[float]:
    tensor = transform(img).unsqueeze(0).to(DEVICE)
    feats = descriptor(tensor)  # (1, num_features)
    feats = torch.nn.functional.normalize(feats, p=2, dim=1)  # L2-normalizado
    return feats.squeeze(0).cpu().numpy().astype(np.float32).tolist()


@app.get("/")
def health():
    return {"status": "ok", "device": DEVICE}


@app.post("/embed")
async def embed_endpoint(file: UploadFile = File(...)):
    try:
        raw = await file.read()
        img = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Imagen inválida: {exc}")

    cropped, detected = crop_cat(img)
    vector = embed(cropped)
    return {"embedding": vector, "dim": len(vector), "detected": detected}
