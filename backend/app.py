# app.py
from flask import Flask, jsonify, request

app = Flask(__name__)

# Test route
@app.route('/')
def home():
    return "Hello from Flask backend!"

# Example API
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "This is a test API response"})

if __name__ == "__main__":
    app.run(debug=True)
