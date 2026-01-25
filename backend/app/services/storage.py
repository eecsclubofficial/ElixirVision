from app.database import supabase_client

BUCKET = "images"

def upload_image(file_path, file_name):
    with open(file_path, "rb") as f:
        supabase.storage.from_(BUCKET).upload(file_name, f)
