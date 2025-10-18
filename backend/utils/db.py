# utils/db.py
"""
MongoDB connection helper.
Exports: users_collection
"""

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")  
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not set in .env")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

db = client.get_database(os.getenv("MONGO_DBNAME", "zkp_demo"))

users = db.get_collection("users")
users.create_index("username", unique=True)

# Sessions collection to persist session tokens across server restarts
sessions = db.get_collection("sessions")
sessions.create_index("token", unique=True)
