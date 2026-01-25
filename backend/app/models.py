from dataclasses import dataclass
from typing import List, Optional
from uuid import UUID


@dataclass
class Image:
    id: UUID
    filename: str
    phash: Optional[str]
    ahash: Optional[str]
    dhash: Optional[str]
    embedding: List[float]
