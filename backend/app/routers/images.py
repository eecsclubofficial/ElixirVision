from fastapi import APIRouter, UploadFile, File, HTTPException
from app.database import supabase_client
import uuid, re

router = APIRouter(tags=["Images"])

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()

        safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", file.filename)
        filename = f"{uuid.uuid4()}_{safe_name}"

        res = supabase_client.storage.from_("images").upload(
            filename,
            file_bytes,
            {"content-type": file.content_type}
        )

        if res.get("error"):
            raise HTTPException(status_code=500, detail=res["error"])

        return {
            "message": "Image uploaded successfully",
            "filename": filename
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
