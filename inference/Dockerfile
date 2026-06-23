# Hugging Face Space — Docker SDK
FROM python:3.11-slim

# YOLO/opencv necesita estas libs del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# HF Spaces ejecuta como usuario no-root; cache de modelos en /app
ENV HF_HOME=/app/.cache \
    TORCH_HOME=/app/.cache \
    YOLO_CONFIG_DIR=/app/.cache \
    PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Pre-descarga de pesos en el build (evita cold start eterno en la 1ª petición)
RUN python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')" && \
    python -c "import timm; timm.create_model('hf-hub:BVRA/MegaDescriptor-L-384', pretrained=True, num_classes=0)"

RUN mkdir -p /app/.cache && chmod -R 777 /app/.cache

# HF Spaces expone el puerto 7860
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
