# routes/wallet.py
from flask import Blueprint, request, jsonify
from models import wallet_db

wallet_bp = Blueprint('wallet', __name__)


#initialize mock wallet
@wallet_bp.route('/wallet/create', methods=['POST'])
def create_wallet():
    data = request.json
    username = data['username']
    if username in wallet_db:
        return jsonify({"error": "Wallet already exists"}), 400

    wallet_db[username] = {
        "balance": 1000,  # starting balance
        "tx_history": []
    }
    return jsonify({"message": "Wallet created", "balance": 1000}), 201


#return balance
@wallet_bp.route('/wallet/balance/<username>', methods=['GET'])
def get_balance(username):
    if username not in wallet_db:
        return jsonify({"error": "Wallet not found"}), 404
    return jsonify({"balance": wallet_db[username]['balance']}), 200


#simulate fund transfer
@wallet_bp.route('/wallet/send', methods=['POST'])
def send_funds():
    data = request.json
    from_user = data['from_user']
    to_user = data['to_user']
    amount = data['amount']

    if from_user not in wallet_db or to_user not in wallet_db:
        return jsonify({"error": "User not found"}), 404

    if wallet_db[from_user]['balance'] < amount:
        return jsonify({"error": "Insufficient balance"}), 400

    wallet_db[from_user]['balance'] -= amount
    wallet_db[to_user]['balance'] += amount

    tx = {"from": from_user, "to": to_user, "amount": amount}
    wallet_db[from_user]['tx_history'].append(tx)
    wallet_db[to_user]['tx_history'].append(tx)

    return jsonify({"message": "Transaction successful", "tx": tx}), 200


#transaction history
@wallet_bp.route('/wallet/tx/<username>', methods=['GET'])
def tx_history(username):
    if username not in wallet_db:
        return jsonify({"error": "Wallet not found"}), 404
    return jsonify({"tx_history": wallet_db[username]['tx_history']}), 200
