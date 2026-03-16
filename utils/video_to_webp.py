import os
import cv2
from PIL import Image

# -------------------------------
# Step 1: Ensure the folder exists
# -------------------------------
if not os.path.exists("images"):
    os.makedirs("images")

# -------------------------------
# Step 2: Video file
# -------------------------------
video_path = "7202cfe9-0f53-4a73-8c79-787481747f79.mp4"

# -------------------------------
# Step 3: Open video and read frame
# -------------------------------
cap = cv2.VideoCapture(video_path)

success, frame = cap.read()
if success:
    # Convert BGR (OpenCV) to RGB (PIL)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame_rgb)

    # -------------------------------
    # Step 4: Save in multiple formats
    # -------------------------------
    formats = ["WEBP", "PNG", "JPEG"]
    for fmt in formats:
        path = f"images/dog_image.{fmt.lower()}"
        img.save(path, fmt)
        print(f"✅ Saved as {path}")

else:
    print("❌ Failed to read video")

cap.release()
