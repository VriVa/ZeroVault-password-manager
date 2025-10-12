# app.py
from flask import Flask, jsonify
from routes.auth import auth_bp
from routes.wallet import wallet_bp

app = Flask(__name__)

# Register route blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(wallet_bp, url_prefix='/api')

# Optional root route to test server
@app.route('/')
def home():
    return "Flask backend is running!"

if __name__ == "__main__":
    app.run(debug=True)
