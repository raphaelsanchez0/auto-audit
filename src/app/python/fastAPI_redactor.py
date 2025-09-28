from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
import io
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import pytesseract
import fitz  # PyMuPDF
import re

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # must match your frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Tesseract path inside Docker
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"  # Adjust for container

# ---------------------
# Redaction helpers
# ---------------------
def preprocess_image(img: Image.Image) -> Image.Image:
    img = img.convert("L")
    img = ImageOps.autocontrast(img)
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    img = img.point(lambda x: 0 if x < 128 else 255, "1")
    return img

def get_sensitive_data(text_lines):
    patterns = {
        "email": r"[\w\.\d]+@[\w\d-]+\.[\w\d.-]+",
        "phone": r"(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})",
        "ssn": r"\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b",
        "dob": r"\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}-\d{1,2}-\d{1,2})\b",
        "name": r"(?i)(?:My name is|I am|He is|She is|Name:|name is) ([A-Z][a-z]+(?: [A-Z][a-z]+)+)",
        "address": r"\b\d{1,6}\s+[A-Za-z0-9.,'’\- ]+\s*,?\s*[A-Za-z\- ]+\s*,?\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)?\s+\d{5}(?:-\d{4})?\b"
    }
    sensitive_matches = []
    for line in text_lines:
        for pattern in patterns.values():
            for match in re.findall(pattern, line):
                if isinstance(match, tuple):
                    sensitive_matches.append("".join(match))
                else:
                    sensitive_matches.append(match)
    return sensitive_matches

# ---------------------
# Main redaction logic
# ---------------------
def redact_pdf_bytes(pdf_bytes: bytes) -> bytes:
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    scanned_images = []

    for page_num, page in enumerate(doc):
        page.wrap_contents()
        text = page.get_text("text").strip()

        if text:
            sensitive_data = get_sensitive_data(text.splitlines())
            for data in sensitive_data:
                areas = page.search_for(data)
                [page.add_redact_annot(area, fill=(0, 0, 0)) for area in areas]
            page.apply_redactions()
        else:
            pix = page.get_pixmap(dpi=300)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img_preprocessed = preprocess_image(img)

            ocr_data = pytesseract.image_to_data(
                img_preprocessed, output_type=pytesseract.Output.DICT, config="--oem 1 --psm 3"
            )

            draw = ImageDraw.Draw(img)
            lines = {}
            for i, word in enumerate(ocr_data["text"]):
                if word.strip():
                    y = ocr_data["top"][i]
                    lines.setdefault(y, []).append((i, word))

            for y, words in lines.items():
                line_text = " ".join([w for _, w in words])
                sensitive = get_sensitive_data([line_text])
                for s in sensitive:
                    for idx, w in words:
                        if w in s:
                            x, y, w_box, h = (
                                ocr_data["left"][idx],
                                ocr_data["top"][idx],
                                ocr_data["width"][idx],
                                ocr_data["height"][idx],
                            )
                            draw.rectangle([x, y, x + w_box, y + h], fill="black")
            scanned_images.append(img)

    # Convert redacted content to PDF bytes
    output_buffer = io.BytesIO()
    if scanned_images:
        scanned_images[0].save(output_buffer, save_all=True, append_images=scanned_images[1:])
    else:
        doc.save(output_buffer)
    return output_buffer.getvalue()

# ---------------------
# FastAPI endpoints
# ---------------------
@app.post("/redact/")
async def redact_endpoint(file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    redacted_bytes = redact_pdf_bytes(pdf_bytes)
    return StreamingResponse(
        io.BytesIO(redacted_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=redacted_{file.filename}"}
    )
