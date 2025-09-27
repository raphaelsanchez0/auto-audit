from fastAPI import FastAPI, UploadFile
from redactor import Redactor
import tempfile, shutil

app = FastAPI()

@app.post("/redact")
async def redact(file: UploadFile):
    with tempfile.TemporaryDirectory() as tmpdir:
        path = f"{tmpdir}/{file.filename}"
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        redactor = Redactor(tmpdir)
        redactor.process_folder()
        return{"message": "Redacted successfully"}