import sys
from PIL import Image, ImageDraw

def mask_circle(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    mask = Image.new("L", img.size, 0)
    draw = ImageDraw.Draw(mask)
    
    width, height = img.size
    offset = min(width, height) * 0.02 # Crop slightly in to hide white fringing
    draw.ellipse((offset, offset, width - offset, height - offset), fill=255)
    
    result = Image.new("RGBA", img.size)
    result.paste(img, (0, 0), mask=mask)
    
    result.save(output_path, "PNG")
    print(f"Successfully processed {output_path}")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        mask_circle(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python mask_circle.py <input> <output>")
