from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
import pickle
import requests
import shutil
import uuid
import cv2
import whisper
from flask import send_file
from moviepy.editor import ImageSequenceClip, AudioFileClip, VideoFileClip
from tqdm import tqdm
from werkzeug.utils import secure_filename



# Initialize Flask app
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app, resources={r"/*": {"origins": "*"}}) # Enable CORS for all routes

# --- Load models using tf.saved_model.load() ---

cnn_model = tf.saved_model.load("models/cnn_model")
encoder_model = tf.saved_model.load("models/encoder")
decoder_model = tf.saved_model.load("models/decoder")
vectorization_model = tf.saved_model.load("models/vectorization")

# Load vocab from pickle
import pickle

with open("models/vocab.pkl", "rb") as f:
    vocab = pickle.load(f)

index_lookup = dict(zip(range(len(vocab)), vocab))

# --- LOAD YOUR SENTIMENT TRANSFORMATION MODEL ---
# OLLAMA API URL
OLLAMA_API_URL = "http://localhost:11434/api/generate"

def call_mistral(prompt):
    try:
        payload = {
            "model": "mistral",   # if your local model is named differently, adjust here
            "prompt": prompt,
            "stream": False
        }
        print(f"🌐 Sending prompt to Ollama: {prompt}")
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        output = response.json()
        generated_text = output.get("response", "").strip()
        print(f"✅ Received from Mistral: {generated_text}")
        return generated_text
    except Exception as e:
        print(f"❌ Ollama API call failed: {e}")
        return "Sorry, could not generate response."

def create_prompt(caption, style):
    if style == "humor":
        return f"Make the following caption funny in one line only: '{caption}'"
    elif style == "sarcasm":
        return f"Make the following caption sarcastic in one line only: '{caption}'"
    elif style == "punify":
        return f"Turn the following caption into a pun in one line only: '{caption}'"
    elif style == "rephrase":
        return f"Rephrase the following caption in a creative way in one line only: '{caption}'"
    else:
        return caption

@app.route('/transform_caption', methods=['POST'])
def transform_caption():
    try:
        data = request.get_json()
        print("📩 Received Data:", data)

        original_caption = data.get("caption")
        style = data.get("style")

        if not original_caption or not style:
            return jsonify({"error": "Missing caption or style"}), 400

        # Build a smart prompt based on user style
        prompt = create_prompt(original_caption, style)

        # Call the Mistral model via Ollama server
        transformed_caption = call_mistral(prompt)

        return jsonify({"transformed_caption": transformed_caption})

    except Exception as e:
        print(f"❌ Error in /transform_caption:", e)
        return jsonify({"error": str(e)}), 500

# --- Constants ---

IMAGE_SIZE = (299, 299)
SEQ_LENGTH = 25
max_decoded_sentence_length = SEQ_LENGTH - 1

# --- Utility functions ---

def decode_and_resize(img_path):
    """Read and preprocess the uploaded image."""
    img = tf.io.read_file(img_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, IMAGE_SIZE)
    img = tf.image.convert_image_dtype(img, tf.float32)
    return img

def generate_caption(image_path):
    """Generate a readable caption from an image."""
    sample_img = decode_and_resize(image_path)
    img_tensor = tf.expand_dims(sample_img, 0)

    # Pass through CNN and Encoder
    features = cnn_model(img_tensor)
    encoded_img = encoder_model(features)

    decoded_caption = "<start> "
    output_caption = []

    for i in range(max_decoded_sentence_length):
        tokenized_caption = vectorization_model([decoded_caption])[:, :-1]
        tokenized_caption = tf.cast(tokenized_caption, tf.float32)
        mask = tf.math.not_equal(tokenized_caption, 0)

        predictions = decoder_model([tokenized_caption, encoded_img, mask])
        sampled_token_index = np.argmax(predictions[0, i, :])

        # Map token index to word using vocab
        sampled_word = index_lookup.get(sampled_token_index, "")

        if sampled_word == "<end>":
            break

        output_caption.append(sampled_word)
        decoded_caption += " " + sampled_word

    final_caption = " ".join(output_caption)
    return final_caption.strip().capitalize() + "."


# --- API routes ---

@app.route("/caption", methods=["POST"])
def caption_image():
    """Receive an image from frontend and return a caption."""
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    os.makedirs('uploads', exist_ok=True)
    image_path = os.path.join('uploads', image.filename)
    image.save(image_path)

    caption = generate_caption(image_path)

    return jsonify({'caption': caption})

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    """Serve the React frontend."""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")
    

UPLOAD_FOLDER = "uploads"
PROCESSED_FOLDER = "processed_videos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

FONT = cv2.FONT_HERSHEY_SIMPLEX
FONT_SCALE = 0.8
FONT_THICKNESS = 2

model = whisper.load_model("base")  # Load once at startup

@app.route("/caption_video", methods=["POST"])
def caption_video():
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video_file = request.files["video"]
    filename = secure_filename(video_file.filename)
    uid = str(uuid.uuid4())
    video_path = os.path.join(UPLOAD_FOLDER, f"{uid}_{filename}")
    video_file.save(video_path)

    try:
        audio_path = os.path.join(UPLOAD_FOLDER, f"{uid}_audio.mp3")
        video = VideoFileClip(video_path)
        video.audio.write_audiofile(audio_path)

        print("\u2705 Audio extracted")
        result = model.transcribe(audio_path, word_timestamps=True)
        print("\u2705 Transcription done")

        text_segments = []
        for segment in result["segments"]:
            for word in segment["words"]:
                text_segments.append({
                    "text": word["word"].strip(),
                    "start": word["start"],
                    "end": word["end"]
                })

        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        output_frames_path = os.path.join(UPLOAD_FOLDER, f"{uid}_frames")
        os.makedirs(output_frames_path, exist_ok=True)

        frame_index = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            current_time = frame_index / fps

            for segment in text_segments:
                if segment["start"] <= current_time <= segment["end"]:
                    text = segment["text"]
                    text_size, _ = cv2.getTextSize(text, FONT, FONT_SCALE, FONT_THICKNESS)
                    text_x = int((frame.shape[1] - text_size[0]) / 2)
                    text_y = height - 50
                    cv2.putText(frame, text, (text_x, text_y), FONT, FONT_SCALE, (255, 255, 255), FONT_THICKNESS)
                    break

            out_path = os.path.join(output_frames_path, f"{frame_index}.jpg")
            cv2.imwrite(out_path, frame)
            frame_index += 1

        cap.release()

        frame_files = [f for f in os.listdir(output_frames_path) if f.endswith(".jpg")]
        frame_files.sort(key=lambda x: int(x.split(".")[0]))
        image_paths = [os.path.join(output_frames_path, f) for f in frame_files]

        clip = ImageSequenceClip(image_paths, fps=fps)
        audio = AudioFileClip(audio_path)
        clip = clip.set_audio(audio)

        final_video_path = os.path.join(PROCESSED_FOLDER, f"{uid}_captioned.mp4")
        clip.write_videofile(final_video_path, codec='libx264')

        shutil.rmtree(output_frames_path)
        os.remove(audio_path)

        return send_file(final_video_path, as_attachment=True)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Something went wrong processing the video."}), 500

# --- Run app ---

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
