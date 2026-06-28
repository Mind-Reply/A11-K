from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
import psycopg2
import os

app = Flask(__name__)
CORS(app)

# JWT config
app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# DATABASE CONNECTION
def get_db():
    return psycopg2.connect(os.environ.get("DATABASE_URL"))

# INIT TABLE
def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE,
            password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

# REGISTER
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (data["email"], data["password"])
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "user created"})

# LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (data["email"], data["password"])
    )

    user = cur.fetchone()

    if not user:
        return jsonify({"error": "invalid credentials"}), 401

    token = create_access_token(identity=data["email"])
    return jsonify({"token": token})

# PROTECTED ROUTE
@app.route("/profile")
@jwt_required()
def profile():
    user = get_jwt_identity()
    return jsonify({"logged_in_as": user})

# HEALTH
@app.route("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)