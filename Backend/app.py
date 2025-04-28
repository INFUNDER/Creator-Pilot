from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__, static_folder="build", static_url_path="")
CORS(app)

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

# --- Run app ---

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
