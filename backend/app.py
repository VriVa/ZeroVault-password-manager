# app.py
"""
Main Flask entrypoint.
Run with:
  (venv) python app.py
"""

# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from utils.db import db, users 
from routes.auth import auth_bp 

app = Flask(__name__)
CORS(app)  

app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return "Flask backend running with MongoDB!"

# Test DB connection
@app.route("/test-db")
def test_db():
    try:
       
        db.command("ping")
        return jsonify({"status": "success", "message": "Connected to MongoDB!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
