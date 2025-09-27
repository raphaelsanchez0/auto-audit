# 1️⃣ Base image
FROM python:3.11-slim

# 2️⃣ Set working directory inside the container
WORKDIR /app

# 3️⃣ Copy your code
COPY src/ /app/src/

# 4️⃣ Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ Install system packages needed for OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    libjpeg-dev \
    zlib1g-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python-multipart separately
RUN pip install python-multipart

# 6️⃣ Expose FastAPI port
EXPOSE 8000

# 7️⃣ Run FastAPI - Fix the path to match your file structure
CMD ["uvicorn", "src.app.python.fastAPI_redactor:app", "--host", "0.0.0.0", "--port", "8000"]