import cv2
from PIL import Image

CONFIGS = [
    ("scroll-bg.mp4",        "sprite-desktop.jpg", 480, 270),
    ("scroll-bg-mobile.mp4", "sprite-mobile.jpg",  240, 135),
]
N_FRAMES, COLS, ROWS = 100, 10, 10
PUBLIC = "artifacts/sprizzle/public"

for src, dst, fw, fh in CONFIGS:
    cap = cv2.VideoCapture(f"{PUBLIC}/{src}")
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    indices = [int(i * (total - 1) / (N_FRAMES - 1)) for i in range(N_FRAMES)]
    sheet = Image.new("RGB", (fw * COLS, fh * ROWS))
    for i, idx in enumerate(indices):
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ok, frame = cap.read()
        if not ok:
            print(f"  Warning: could not read frame {idx}")
            continue
        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        img = img.resize((fw, fh), Image.LANCZOS)
        col, row = i % COLS, i // COLS
        sheet.paste(img, (col * fw, row * fh))
    cap.release()
    sheet.save(f"{PUBLIC}/{dst}", "JPEG", quality=82, optimize=True)
    size_mb = __import__('os').path.getsize(f"{PUBLIC}/{dst}") / 1_000_000
    print(f"Saved {dst}  ({fw}x{fh} x {N_FRAMES} frames, {size_mb:.1f} MB)")
