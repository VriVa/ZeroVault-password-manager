# app.py
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Import route blueprint
from routes.auth import auth_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["zkp_demo"]  # Database name
users_collection = db["users"]  # Example collection

# Register routes
app.register_blueprint(auth_bp, url_prefix="/api")

# Root route
@app.route("/")
def home():
    return "Flask backend with MongoDB & routes is running!"

# Test route for Mongo
@app.route("/test-db")
def test_db():
    try:
        db.command("ping")
        return jsonify({"status": "success", "message": "Connected to MongoDB!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# Insert dummy user
@app.route("/insert-test")
def insert_test():
    users_collection.insert_one({"name": "Test User"})
    return jsonify({"message": "User inserted!"})

# Get all users
@app.route("/get-users")
def get_users():
    users = list(users_collection.find({}, {"_id": 0}))
    return jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)
