import cv2
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("clip-ViT-B-32")

def generate_embedding(image_path: str):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read image")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    embedding = model.encode(image)
    return embedding.tolist()
