from fastapi import FastAPI, Depends
from app.routers import images, similarity, health
from app.auth import router as auth_router
from app.deps import get_current_user

app = FastAPI(title="Image Duplicate Finder API")

# Routers
app.include_router(auth_router)
app.include_router(health.router)
app.include_router(images.router, prefix="/images", tags=["Images"])
app.include_router(similarity.router, prefix="/similarity", tags=["Similarity"])

@app.get("/")
def root():
    return {"status": "Backend running 🚀"}

@app.post("/upload")
def upload_image(user=Depends(get_current_user)):
    return {
        "message": "Authorized upload",
        "user_id": user["sub"]
    }

