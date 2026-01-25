from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID


class ImageBase(BaseModel):
    filename: str


class ImageCreate(ImageBase):
    pass


class ImageResponse(ImageBase):
    id: UUID
    phash: Optional[str]
    ahash: Optional[str]
    dhash: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


class SimilarImagePair(BaseModel):
    image1: str
    image2: str
    score: float


class SimilarityResponse(BaseModel):
    duplicates: List[SimilarImagePair]
