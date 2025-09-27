# redactor.py
import os
import re
from io import BytesIO
from dotenv import load_dotenv
import psycopg2
import fitz
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import pytesseract

# Load .env
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"  # adjust in container

class Redactor:
    SENSITIVE_PATTERNS = {
        "email": r"[\w\.\d]+@[\w\d-]+\.[\w\d.-]+",
        "phone": r"(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})",
        "ssn": r"\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b",
        "name": r"(?i)(?:My name is|I am|He is|She is|Name:|name is) ([A-Z][a-z]+(?: [A-Z][a-z]+)+)",
        "dob": r"\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}-\d{1,2}-\d{1,2})\b",
        "address": r"\b\d{1,6}\s+[A-Za-z0-9.,'’\- ]+\s*,?\s*[A-Za-z\- ]+\s*,?\s*(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)?\s+\d{5}(?:-\d{4})?\b"
    }

    @staticmethod
    def preprocess_image(img):
        img = img.convert("L")
        img = ImageOps.autocontrast(img)
        img = img.filter(ImageFilter.GaussianBlur(radius=1))
        img = img.point(lambda x: 0 if x < 128 else 255, '1')
        return img

    @staticmethod
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

    def redact_pdf(self, file_id, output_folder="redacted"):
        file_name, pdf_bytes = self.fetch_pdf(file_id)
        if not pdf_bytes:
            print("PDF not found.")
            return

        os.makedirs(output_folder, exist_ok=True)
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        scanned_images = []

        for page_num, page in enumerate(doc):
            page.wrap_contents()
            text = page.get_text("text").strip()

            if text:
                # Text-based redaction
                for pattern in self.SENSITIVE_PATTERNS.values():
                    for match in re.findall(pattern, text):
                        match_str = ''.join(match) if isinstance(match, tuple) else match
                        areas = page.search_for(match_str)
                        [page.add_redact_annot(area, fill=(0,0,0)) for area in areas]
                page.apply_redactions()
            else:
                # OCR for scanned pages
                pix = page.get_pixmap(dpi=500)
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                img_preprocessed = self.preprocess_image(img)

                ocr_data = pytesseract.image_to_data(
                    img_preprocessed, output_type=pytesseract.Output.DICT, config="--oem 1 --psm 3"
                )
                draw = ImageDraw.Draw(img)

                # Combine OCR words into lines
                current_y = None
                line_indices = []
                for i, word in enumerate(ocr_data["text"]):
                    if word.strip():
                        y = ocr_data["top"][i]
                        if current_y is None or abs(y - current_y) < 50:
                            line_indices.append(i)
                        else:
                            # Redact the previous line
                            self._redact_line(draw, ocr_data, line_indices)
                            line_indices = [i]
                        current_y = y
                self._redact_line(draw, ocr_data, line_indices)
                scanned_images.append(img)

        # Save redacted PDF
        output_path = os.path.join(output_folder, os.path.splitext(file_name)[0] + "_redacted.pdf")
        if scanned_images:
            for i in range(len(scanned_images)):
                scanned_images[i] = scanned_images[i].convert("RGB")
            scanned_images[0].save(output_path, save_all=True, append_images=scanned_images[1:])
        else:
            doc.save(output_path)
        print(f"Redacted PDF saved to: {output_path}")

    def _redact_line(self, draw, ocr_data, indices):
        line_text = " ".join([ocr_data["text"][i] for i in indices])
        for pattern in self.SENSITIVE_PATTERNS.values():
            for match in re.findall(pattern, line_text):
                match_str = "".join(match) if isinstance(match, tuple) else match
                match_words = match_str.split()
                for i in indices:
                    word = ocr_data["text"][i]
                    if word in match_words:
                        x, y, w_box, h = (
                            ocr_data["left"][i],
                            ocr_data["top"][i],
                            ocr_data["width"][i],
                            ocr_data["height"][i],
                        )
                        draw.rectangle([x, y, x + w_box, y + h], fill="black")


if __name__ == "__main__":
    file_id = int(input("Enter PDF ID to redact: "))
    redactor = Redactor()
    redactor.redact_pdf(file_id)
