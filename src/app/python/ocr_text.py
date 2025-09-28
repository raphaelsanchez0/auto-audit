import fitz  # PyMuPDF
from PIL import Image, ImageFilter, ImageOps
import pytesseract
import sys
import os
import numpy as np
from io import BytesIO
from dotenv import load_dotenv
import psycopg2


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(img):
    # Convert to grayscale
    img = img.convert("L")

    # Increase contrast
    img = ImageOps.autocontrast(img)

    # Apply a slight blur to reduce noise
    img = img.filter(ImageFilter.GaussianBlur(radius=1))

    # Apply thresholding
    img = img.point(lambda x: 0 if x < 128 else 255, '1')

    return img

def fetch_pdf(file_id):
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("SELECT file_name, file_data FROM pdf_files WHERE id = %s", (file_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row:
        file_name, file_data = row
        return file_name, BytesIO(file_data)
    return None, None


def pdf_to_text(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = []

    for page_num, page in enumerate(doc):
        # Extract text normally
        text = page.get_text("text").strip()
        if text:
            full_text.append(f"--- Page {page_num + 1} ---\n{text}\n")
        else:
            # OCR for scanned page
            pix = page.get_pixmap(dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img_preprocessed = preprocess_image(img)
            text_ocr = pytesseract.image_to_string(img_preprocessed, config=" --oem 1 --psm 3")
            full_text.append(f"--- Page {page_num + 1} (OCR) ---\n{text_ocr}\n")

    return "\n".join(full_text)

if __name__ == "__main__":
    file_id = int(input("Enter PDF ID to extract: "))
    file_name, pdf_bytes = fetch_pdf(file_id)
    if pdf_bytes:
        extracted_text = pdf_to_text(pdf_bytes)
        print(f"Extracted text from '{file_name}':\n")
        print(extracted_text)
    else:
        print("PDF not found.")