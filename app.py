from flask import Flask, request, jsonify
from flask_cors import CORS
import requests  # if you're making external web requests

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        url = data.get('url')

        if not url:
            return jsonify({'error': 'No URL provided'}), 400

        # Example: Make a GET request to the URL
        response = requests.get(url)
        
        # Dummy response for now
        return jsonify({
            'url': url,
            'status': 'Scanned successfully',
            'response_code': response.status_code
        })

    except Exception as e:
        print("Error in /predict:", str(e))
        return jsonify({'error': 'Something went wrong on the server'}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
