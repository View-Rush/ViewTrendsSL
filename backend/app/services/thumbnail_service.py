"""Thumbnail service for handling uploads and analysis."""
import time
from fastapi import HTTPException
from storage3.types import UploadResponse

from app.core.config import settings
from supabase import create_client, Client

BUCKET_NAME = "thumbnails"

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


async def upload_thumbnail_to_supabase(file, user_id: str = "public"):
    """Uploads thumbnail image to Supabase and returns its public URL."""
    contents = await file.read()

    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, or WEBP allowed")
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    file_path = f"{user_id}/{int(time.time())}-{file.filename}"

    try:
        res = supabase.storage.from_(BUCKET_NAME).upload(file_path, contents)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    try:
        public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)

        if not public_url:
            raise Exception("Public URL not returned")

        return {
            "public_url": public_url,
            "path": file_path,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get public URL: {str(e)}")
