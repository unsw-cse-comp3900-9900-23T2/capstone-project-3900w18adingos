import io
from PIL import Image
from datetime import datetime
import random

def get_image_bytes(file_path):
    img_byte_array = io.BytesIO()
    img = Image.open(file_path, mode='r')
    img.save(img_byte_array, format='JPEG', subsampling=0, quality=100)
    return img_byte_array.getvalue()

# current time + random int, collision unlikely
def generate_image_filename():
    now = datetime.now().timestamp()
    new_str = f"{now}:{random.randint(0,100)}"
