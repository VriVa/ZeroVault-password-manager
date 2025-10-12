# routes/auth.py
from flask import Blueprint, request, jsonify
from models import users_db
from utils import generate_challenge, verify_schnorr

auth_bp = Blueprint('auth', __name__)

# For demo, small Schnorr parameters (replace with secure ones in production)
G = 2
P = 1019

#stores Schnorr public key, salt, and encrypted vault
@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user
    Request JSON: { "username": str, "Y": int, "salt": str, "vault_blob": str }
    """
    data = request.json
    username = data['username']
    if username in users_db:
        return jsonify({"error": "User already exists"}), 400

    users_db[username] = {
        "Y": int(data['Y']),
        "salt": data['salt'],
        "vault_blob": data['vault_blob'],
        "current_challenge": None
    }
    return jsonify({"message": "User registered successfully"}), 201


#issues ephemeral challenge
@auth_bp.route('/login/challenge', methods=['POST'])
def login_challenge():
    """
    Client sends username, server returns challenge
    Request JSON: { "username": str }
    """
    data = request.json
    username = data['username']
    if username not in users_db:
        return jsonify({"error": "User not found"}), 404

    c = generate_challenge()
    users_db[username]['current_challenge'] = c
    return jsonify({"challenge": c}), 200


#verifies Schnorr proof and returns encrypted vault on success
@auth_bp.route('/login/verify', methods=['POST'])
def login_verify():
    """
    Verify Schnorr proof sent by client
    Request JSON: { "username": str, "R": int, "s": int }
    """
    data = request.json
    username = data['username']
    if username not in users_db:
        return jsonify({"error": "User not found"}), 404

    user = users_db[username]
    c = user['current_challenge']
    if c is None:
        return jsonify({"error": "No challenge issued"}), 400

    R = int(data['R'])
    s = int(data['s'])
    Y = user['Y']

    if verify_schnorr(Y, R, s, c, G, P):
        user['current_challenge'] = None  # reset challenge
        return jsonify({"message": "Login successful", "vault_blob": user['vault_blob']}), 200
    else:
        return jsonify({"error": "Invalid proof"}), 400
