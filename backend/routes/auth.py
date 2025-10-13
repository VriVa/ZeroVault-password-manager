# routes/auth.py
from utils.logger import log_event

import secrets
from flask import Blueprint, request, jsonify
from utils.db import users
from datetime import datetime
import uuid
import random
from datetime import  timedelta
from flask import request

sessions = {}
SESSION_TTL = 900  

challenges = {}
CHALLENGE_TTL = 120

login_attempts = {}
MAX_ATTEMPTS = 5
BLOCK_DURATION = timedelta(minutes=15)

auth_bp = Blueprint("auth", __name__)



def get_username_from_token():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
    token = auth_header.split()[1]
    session = sessions.get(token)
    if not session:
        return None
    if datetime.utcnow() > session["expires_at"]:
        del sessions[token]  # remove expired
        return None
    return session["username"]



@auth_bp.route("/auth/register", methods=["POST"])
def register():
    """
    Registers a new user
    Expects JSON: { username, publicY, salt_kdf, kdf_params, vault_blob }
    """
    data = request.get_json()

    # Basic validation
    required_fields = ["username", "publicY", "salt_kdf", "kdf_params"]
    for field in required_fields:
        if field not in data:
            return jsonify({"status": "error", "message": f"Missing {field}"}), 400

    username = data["username"]

    # Check if username already exists
    if users.find_one({"username": username}):
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    # Prepare user record
    user_doc = {
        "username": username,
        "publicY": data["publicY"],
        "salt_kdf": data["salt_kdf"],
        "kdf_params": data["kdf_params"],
        "vault_blob": data.get("vault_blob", None),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    try:
        users.insert_one(user_doc)
        log_event("REGISTER", username=username, details="New user registered.")
        return jsonify({"status": "success", "message": "User registered successfully"})
    
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500




@auth_bp.route("/auth/challenge", methods=["POST"])
def generate_challenge():
    """
    Generates a Schnorr challenge for login
    Expects JSON: { username }
    Returns: { challenge_id, c, expires_at }
    """
    data = request.get_json()
    username = data.get("username")

    # Check if user exists
    user = users.find_one({"username": username})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    # Generate random challenge
    c = random.randint(100000, 999999) 
    challenge_id = str(uuid.uuid4())
    now = datetime.utcnow()
    expires_at = now + timedelta(seconds=CHALLENGE_TTL)

    # Store challenge in memory
    challenges[challenge_id] = {
        "username": username,
        "c": c,
        "issued_at": now,
        "expires_at": expires_at,
        "used": False
    }

    return jsonify({
        "status": "success",
        "challenge_id": challenge_id,
        "c": c,
        "expires_at": expires_at.isoformat()
    })



@auth_bp.route("/auth/verify", methods=["POST"])
def verify_proof():
    """
    Verifies Schnorr proof from frontend.
    Expects JSON: { username, challenge_id, R, s }
    Returns vault_blob + session_token if valid.
    Includes in-memory brute-force protection.
    """
    data = request.get_json()
    username = data.get("username")
    challenge_id = data.get("challenge_id")
    R = data.get("R")
    s = data.get("s")

    # 1 Basic validation
    if not all([username, challenge_id, R, s]):
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    now = datetime.utcnow()

    # 2 Check if user is blocked due to multiple failed attempts
    attempt = login_attempts.get(username, {"failed_attempts": 0, "blocked_until": None})
    if attempt["blocked_until"] and now < attempt["blocked_until"]:
        return jsonify({
            "status": "error",
            "message": "Too many failed attempts. Try again later."
        }), 403

    # 3 Retrieve challenge from in-memory store
    challenge = challenges.get(challenge_id)
    if not challenge:
        return jsonify({"status": "error", "message": "Invalid challenge ID"}), 404

    # 4 Validate challenge info
    if challenge["username"] != username:
        return jsonify({"status": "error", "message": "Username mismatch"}), 400
    if challenge["used"]:
        return jsonify({"status": "error", "message": "Challenge already used"}), 400
    if now > challenge["expires_at"]:
        return jsonify({"status": "error", "message": "Challenge expired"}), 400

    # 5 Fetch user record
    user = users.find_one({"username": username})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    # 6 Verify Schnorr proof (demo modular math)
    try:
        c = challenge["c"]
        Y = int(user["publicY"])  # in real ZKP, decode hex/base64 to EC point
        R_int = int(R)
        s_int = int(s)
        p = 1000003  # Demo prime 

        if (s_int % p) == (R_int + c * Y) % p:
            # Valid proof
            challenge["used"] = True

            # Reset failed attempts on success
            login_attempts[username] = {"failed_attempts": 0, "blocked_until": None}

            # Create session token with TTL (15 minutes)
            token = secrets.token_hex(16)
            expires_at = datetime.utcnow() + timedelta(minutes=15)
            sessions[token] = {"username": username, "expires_at": expires_at}
            log_event("LOGIN_SUCCESS", username=username, details="ZKP proof verified successfully.")

            vault_blob = user.get("vault_blob", None)
            return jsonify({
                "status": "success",
                "message": "Login verified",
                "vault_blob": vault_blob,
                "session_token": token,
                "expires_at": expires_at.isoformat()
            }), 200

        else:
            log_event("LOGIN_FAIL", username=username, details="Invalid proof attempt.")

            # Invalid proof: increment failed attempts
            attempt["failed_attempts"] += 1
            if attempt["failed_attempts"] >= MAX_ATTEMPTS:
                attempt["blocked_until"] = now + BLOCK_DURATION

            login_attempts[username] = attempt
            return jsonify({
                "status": "error",
                "message": "Invalid proof. Attempt {} of {}.".format(
                    attempt["failed_attempts"], MAX_ATTEMPTS
                )
            }), 400

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@auth_bp.route("/vault", methods=["GET"])
def get_vault():
    """
    Get the vault_blob for a user.
    Expects query param: ?username=alice
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 401

    user = users.find_one({"username": username})
    vault_blob = user.get("vault_blob", None)
    return jsonify({"status": "success", "vault_blob": vault_blob})



@auth_bp.route("/vault", methods=["POST"])
def update_vault():
    """
    Update the vault_blob for a user.
    Expects JSON: { username, vault_blob: { iv, ciphertext, tag, version } }
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 401

    data = request.get_json()
    vault_blob = data.get("vault_blob")
    if not vault_blob:
        return jsonify({"status": "error", "message": "Missing vault_blob"}), 400

    users.update_one(
        {"username": username},
        {"$set": {"vault_blob": vault_blob, "updated_at": datetime.utcnow()}}
    )
    log_event("VAULT_UPDATE", username=username, details="User updated vault.")

    return jsonify({"status": "success", "message": "Vault updated successfully"})

    
