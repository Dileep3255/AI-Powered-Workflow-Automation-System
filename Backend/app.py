import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = Flask(__name__)
CORS(app)

@app.route('/extract-text', methods=['POST'])
def extract_text():

    try:

        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        try:
            image = Image.open(file.stream)
        except Exception:
            return jsonify({"error": "Invalid image file"}), 400

        extracted_text = pytesseract.image_to_string(image)

        print(extracted_text)

        date_match = re.search(r'\d{2}/\d{2}/\d{4}', extracted_text)

        quantity_match = re.search(r'Quantity:\s*(\d+)', extracted_text)

        structured_data = {
            "date": date_match.group() if date_match else "Not Found",
            "quantity": quantity_match.group(1) if quantity_match else "Not Found",
            "raw_text": extracted_text
        }

        return jsonify(structured_data)

    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == '__main__':
    app.run(debug=True)