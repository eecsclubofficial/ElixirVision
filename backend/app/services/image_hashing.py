from PIL import Image
import imagehash

def generate_hashes(image_path: str):
    img = Image.open(image_path)
    return {
        "phash": str(imagehash.phash(img)),
        "ahash": str(imagehash.average_hash(img)),
        "dhash": str(imagehash.dhash(img))
    }
