import os
from PIL import Image

def validate_image(path: str):
    try:
        img = Image.open(path)
        img.verify()
        return True
    except Exception:
        return False


def get_image_size(path: str):
    img = Image.open(path)
    return img.size
