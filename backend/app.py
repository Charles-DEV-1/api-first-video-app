from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import os
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)

jwt = JWTManager(app)

# MongoDB Connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client.videoapp_test
users = db.users
videos = db.videos

# ========== HELPER FUNCTIONS ==========
def init_database():
    """Initialize database with sample videos"""
    if videos.count_documents({}) == 0:
        sample_videos = [
            {
                "title": "Flask Complete Tutorial",
                "description": "Learn Flask for Python - Full Tutorial",
                "youtube_id": "Z1RJmh_OqeA",  # Example ID
                "thumbnail_url": "https://img.youtube.com/vi/Z1RJmh_OqeA/default.jpg",
                "is_active": True
            },
            {
                "title": "Flask Complete Tutorial",
                "description": "Learn Flask for Python - Full Tutorial",
                "youtube_id": "Z1RJmh_OqeA",  # Example ID
                "thumbnail_url": "https://img.youtube.com/vi/Z1RJmh_OqeA/default.jpg",
                "is_active": True
            }
        ]
        videos.insert_many(sample_videos)
        print("✅ Added sample videos to MongoDB")

# ========== ROUTES ==========
@app.route("/")
def home():
    return jsonify({
        "message": "API-First Video App",
        "database": "MongoDB",
        "endpoints": {
            "POST /auth/signup": "Register user",
            "POST /auth/login": "Login user",
            "GET /dashboard": "Get videos (JWT required)",
            "GET /video/<id>": "Get video with hidden URL (JWT required)"
        }
    })

@app.route("/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    
    # Validate
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password required"}), 400
    
    # Check if user exists
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "User already exists"}), 400
    
    # Hash password
    hashed = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    user = {
        "name": data.get("name", ""),
        "email": data["email"],
        "password": hashed,
        "created_at": datetime.datetime.utcnow()
    }
    
    users.insert_one(user)
    return jsonify({"message": "User created successfully"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    
    # Find user
    user = users.find_one({"email": data["email"]})
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Check password
    if bcrypt.checkpw(data["password"].encode('utf-8'), user["password"]):
        # Create JWT token
        token = create_access_token(identity=str(user["_id"]))
        return jsonify({"access_token": token}), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/auth/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user["_id"] = str(user["_id"])
    return jsonify(user), 200

@app.route("/dashboard", methods=["GET"])
@jwt_required()
def get_dashboard():
    # Get 2 active videos
    video_list = list(videos.find({"is_active": True}).limit(2))
    
    # Format response
    for video in video_list:
        video["_id"] = str(video["_id"])
        # Don't send youtube_id to frontend
        if "youtube_id" in video:
            del video["youtube_id"]
    
    return jsonify(video_list), 200

@app.route("/video/<video_id>", methods=["GET"])
@jwt_required()
def get_video(video_id):
    try:
        video = videos.find_one({"_id": ObjectId(video_id), "is_active": True})
    except:
        return jsonify({"error": "Invalid video ID"}), 400
    
    if not video:
        return jsonify({"error": "Video not found"}), 404
    
    # Create safe response with hidden YouTube URL
    response = {
        "_id": str(video["_id"]),
        "title": video["title"],
        "description": video["description"],
        "thumbnail_url": video["thumbnail_url"],
        # YouTube URL hiding: return embed URL instead of raw link
        "video_url": f"https://www.youtube.com/embed/{video['youtube_id']}"
    }
    
    return jsonify(response), 200

@app.route("/auth/logout", methods=["POST"])
@jwt_required()
def logout():
    # JWT is stateless, so we just return success
    return jsonify({"message": "Logged out successfully"}), 200

# Initialize database on startup
with app.app_context():
    init_database()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)