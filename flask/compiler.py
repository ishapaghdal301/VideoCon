from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/compile', methods=['POST'])
def compile_code():
    try:
        data = request.json
        code = data['code']
        language = data['language']
        input_data = data['input']
        
        # Replace the following credentials with your own
        client_id = '8bdb62745746f7fdcef1b24e7ee1d468'
        client_secret = 'e7beba5c6cf30b5dc76098acb5570f0a838220ed89a6cdeaf347266909e4796a'
        api_url = 'https://api.jdoodle.com/v1/execute'

        response = requests.post(api_url, json={
            'clientId': client_id,
            'clientSecret': client_secret,
            'script': code,
            'language': language,
            'versionIndex': '0',
            'stdin': input_data
        })

        if response.ok:
            data = response.json()
            if 'output' in data:
                return jsonify({'output': data['output']}), 200
            elif 'error' in data:
                return jsonify({'error': data['error']}), 400
            else:
                return jsonify({'error': 'Unknown error occurred'}), 500
        else:
            return jsonify({'error': 'Failed to execute code'}), 500
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Internal Server Error'}), 500

@app.errorhandler(404)
def not_found_error(error):
    return 'Not Found', 404

if __name__ == '__main__':
    app.run(port=8000)
