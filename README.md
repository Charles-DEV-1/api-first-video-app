# 🎬 API-First Video App - Assignment Submission

## 📋 Assignment Requirements Completed

| Requirement              | Status | Implementation                     |
| ------------------------ | ------ | ---------------------------------- |
| MongoDB Database         | ✅     | MongoDB Atlas (Cloud)              |
| Flask Backend API        | ✅     | Complete REST API with JWT         |
| YouTube URL Hiding       | ✅     | Embed URLs returned, not raw links |
| React Native Thin Client | ✅     | Frontend with no business logic    |
| JWT Authentication       | ✅     | Secure login/signup flow           |
| API-First Design         | ✅     | Backend drives everything          |

## 🏗️ Architecture Overview

┌─────────────────┐ HTTP/JSON ┌─────────────────┐ JWT Tokens ┌─────────────────┐
│ │◄────────────────│ │◄─────────────────│ │
│ React Native │ │ Flask API │ │ MongoDB │
│ Frontend │────────────────►│ (Python) │─────────────────►│ Atlas │
│ (Thin Client) │ Video Data │ (Port:5000) │ CRUD Ops │ (Cloud) │
│ │ │ │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘

The application follows an API-first architecture where the backend is developed independently of the frontend. The Flask backend serves as the core of the application, handling all business logic, data storage, and authentication. The React Native frontend acts as a thin client that interacts with the backend via RESTful API calls.

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env  #mongodb+srv://videoapp_test:VideoApp123@cluster0.iljm2ry.mongodb.net/videoapp?authSource=admin&retryWrites=true&w=majority
pip install -r requirements.txt
python app.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npx expo start --web
```

🔐 Default Test Credentials
Email: test@test.com

Password: 123456
Use these credentials to log in to the app after signing up.

# Instead of returning raw YouTube URL:

# "https://youtube.com/watch?v=abc123"

# Backend returns embed URL:

response = {
"video_url": f"https://www.youtube.com/embed/{video['youtube_id']}"
}

📡 API Endpoints
Method Endpoint Description
GET / API status
POST /auth/signup Register new user
POST /auth/login Login, get JWT token
GET /dashboard Get 2 videos (JWT required)
GET /video/:id Get video with hidden URL (JWT required)

✅ How Requirements Are Met
API-First Design: Frontend useless without backend

Thin Client: No business logic in React Native

YouTube Hiding: Embed URLs only, no raw links

MongoDB: Cloud Atlas database used

JWT Auth: Secure token-based authentication

Full CRUD: Complete video/user management
