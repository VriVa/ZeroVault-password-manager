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
from ecdsa import SECP256k1, VerifyingKey
from binascii import unhexlify

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
    # Sessions are persistent until explicit logout. Do not expire automatically.
    return session.get("username")



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
        "publicY": data["publicY"], # ec public key hex/base64
        "salt_kdf": data["salt_kdf"], #base64
        "kdf_params": data["kdf_params"], #pbkdf2 params
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
    c = random.randint(1, 2**32) 
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
    t_hex = data.get("t")  # x,y or compressed hex
    s_int = int(data.get("s"))


    # 1 Basic validation
    if not all([username, challenge_id, t_hex, s_int]):
        return jsonify({"status": "error", "message": "Missing fields"}), 400

    now = datetime.utcnow()

    # Get challenge
    challenge = challenges.get(challenge_id)
    if not challenge or challenge["username"] != username or challenge["used"]:
        return jsonify({"status": "error", "message": "Invalid or used challenge"}), 400
    if datetime.utcnow() > challenge["expires_at"]:
        return jsonify({"status": "error", "message": "Challenge expired"}), 400

    c_int = challenge["c"]

    # Fetch user
    user = users.find_one({"username": username})
    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    try:
        # Decode public key
        Y_vk = VerifyingKey.from_string(unhexlify(user["publicY"]), curve=SECP256k1)
        # Decode t from hex (client must send compressed/uncompressed hex)
        t_point = VerifyingKey.from_string(unhexlify(t_hex), curve=SECP256k1).pubkey.point

        # EC Schnorr verification: s*G == t + c*Y
        G = SECP256k1.generator
        order = SECP256k1.order
        lhs = s_int * G
        rhs = t_point + c_int * Y_vk.pubkey.point

        if lhs == rhs:
            challenge["used"] = True
            token = secrets.token_hex(16)
            sessions[token] = {"username": username}
            vault_blob = user.get("vault_blob", None)
            return jsonify({
                "status": "success",
                "message": "Login verified",
                "vault_blob": vault_blob,
                "session_token": token
            })

        else:
            return jsonify({"status": "error", "message": "Invalid proof"}), 400

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




@auth_bp.route("/vault/entries", methods=["GET"])
def get_plain_entries():
    """
    Return plaintext vault entries for the authenticated user.
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 401

    user = users.find_one({"username": username})
    entries = user.get("plain_entries", []) if user else []
    return jsonify({"status": "success", "entries": entries})



@auth_bp.route("/vault/entries", methods=["POST"])
def add_plain_entry():
    """
    Append a plaintext vault entry to the user's plain_entries array.
    Expects JSON body with the entry object (any fields). The server will attach a simple id and timestamp if not provided.
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 401

    data = request.get_json() or {}
    entry = data.get("entry") or data

    # Basic normalization: ensure an id and created_at
    try:
        entry_id = entry.get("id") if isinstance(entry, dict) and entry.get("id") else str(uuid.uuid4())
    except Exception:
        entry_id = str(uuid.uuid4())

    entry.setdefault("id", entry_id)
    entry.setdefault("created_at", datetime.utcnow().isoformat())

    try:
        users.update_one(
            {"username": username},
            {"$push": {"plain_entries": entry}, "$set": {"updated_at": datetime.utcnow()}},
            upsert=True
        )
        log_event("PLAIN_ENTRY_ADD", username=username, details=f"Added plain entry {entry.get('id')}")
        return jsonify({"status": "success", "message": "Entry saved"}), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



@auth_bp.route("/vault/entries/<entry_id>", methods=["DELETE"])
def delete_plain_entry(entry_id):
    """
    Delete a plaintext entry from the user's plain_entries array by id.
    """
    username = get_username_from_token()
    if not username:
        return jsonify({"status": "error", "message": "Invalid or expired token"}), 401

    try:
        res = users.update_one(
            {"username": username},
            {"$pull": {"plain_entries": {"id": entry_id}}, "$set": {"updated_at": datetime.utcnow()}}
        )
        if res.modified_count > 0:
            log_event("PLAIN_ENTRY_DELETE", username=username, details=f"Deleted plain entry {entry_id}")
            return jsonify({"status": "success", "message": "Entry deleted"}), 200
        else:
            # Not found - return success for idempotency
            return jsonify({"status": "success", "message": "Entry not found"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500





@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    """Invalidate the session token (logout)."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"status": "error", "message": "Missing token"}), 400
    token = auth_header.split()[1]
    if token in sessions:
        del sessions[token]
    log_event("LOGOUT", details="User logged out")
    return jsonify({"status": "success", "message": "Logged out"})

    
