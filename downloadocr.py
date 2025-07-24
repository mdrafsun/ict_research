from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from huggingface_hub import login

# === Step 1: Paste your Hugging Face token here ===
HUGGINGFACE_TOKEN = "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"

# === Step 2: Login using the token (non-interactive) ===
login(token=HUGGINGFACE_TOKEN)

# === Step 3: Download and save the fine-tuned math model ===
print("📥 Downloading TrOCR Math Handwritten model...")

processor = TrOCRProcessor.from_pretrained("fhswf/TrOCR_Math_handwritten", use_auth_token=True)
model = VisionEncoderDecoderModel.from_pretrained("fhswf/TrOCR_Math_handwritten", use_auth_token=True)

processor.save_pretrained("trocr_math_model")
model.save_pretrained("trocr_math_model")

print("✅ Model downloaded and saved to 'trocr_math_model/'")
