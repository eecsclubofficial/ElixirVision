from fastapi import APIRouter
from app.database import supabase_client
from app.services.similarity_engine import similarity_score
from app.schemas import SimilarityResponse, SimilarImagePair

router = APIRouter()

@router.get("/duplicates", response_model=SimilarityResponse)
def find_duplicates(threshold: float = 0.9):
    data = supabase_client.table("images").select("*").execute().data

    results = []

    for i in range(len(data)):
        for j in range(i + 1, len(data)):
            score = similarity_score(
                data[i]["embedding"],
                data[j]["embedding"]
            )
            if score >= threshold:
                results.append(
                    SimilarImagePair(
                        image1=data[i]["filename"],
                        image2=data[j]["filename"],
                        score=score
                    )
                )

    return {"duplicates": results}
