from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "duplicate-image-detector",
        "message": "Backend is running"
    }
