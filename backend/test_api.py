import requests

BASE_URL = "http://localhost:5000"

# Test signup
response = requests.post(f"{BASE_URL}/auth/signup", json={
    "name": "charles",
    "email": "test@test.com",
    "password": "123456"
})
print("Signup:", response.json())

# Test login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "test@test.com",
    "password": "123456"
})
print("Login:", response.json())

token = response.json()["access_token"]

# Test dashboard
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(f"{BASE_URL}/dashboard", headers=headers)
print("Dashboard:", response.json())