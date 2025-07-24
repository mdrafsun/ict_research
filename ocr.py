import cv2
import numpy as np
import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

# Load TrOCR model for handwritten math recognition from Hugging Face (online)
#processor = TrOCRProcessor.from_pretrained("fhswf/TrOCR_Math_handwritten")
#trocr_model = VisionEncoderDecoderModel.from_pretrained("fhswf/TrOCR_Math_handwritten")

# Load TrOCR Math model from local directory
processor = TrOCRProcessor.from_pretrained("trocr_math_model")
trocr_model = VisionEncoderDecoderModel.from_pretrained("trocr_math_model")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
trocr_model.to(device)

# Create blank canvas
canvas = np.ones((600, 800, 3), dtype=np.uint8) * 255
drawing = False
last_point = None

def draw(event, x, y, flags, param):
    global drawing, last_point
    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        last_point = (x, y)
    elif event == cv2.EVENT_MOUSEMOVE and drawing:
        if last_point:
            cv2.line(canvas, last_point, (x, y), (0, 0, 0), thickness=4)
        last_point = (x, y)
    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        last_point = None

cv2.namedWindow("Canvas")
cv2.setMouseCallback("Canvas", draw)

print("Draw on the canvas using your pen tablet or mouse.")
print("Press 'r' to recognize, 'c' to clear, 'q' to quit.")

while True:
    cv2.imshow("Canvas", canvas)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break
    elif key == ord('c'):
        canvas[:] = 255  # Clear canvas
    elif key == ord('r'):
        # Convert to PIL and grayscale
        canvas_rgb = cv2.cvtColor(canvas, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(canvas_rgb)

        try:
            # Run TrOCR
            inputs = processor(images=pil_img, return_tensors="pt").pixel_values.to(device)
            generated_ids = trocr_model.generate(inputs)
            text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        except Exception as e:
            text = f"[Error: {str(e)}]"

        print(f"\n Recognized: {text}\n")

cv2.destroyAllWindows()
