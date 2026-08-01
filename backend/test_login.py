import requests
import json

print("\n🔐 Test du endpoint de connexion...\n")

url = "http://localhost:8000/api/users/login/"
data = {
    "email": "admin@test.com",
    "password": "admin1234"
}

print(f"📍 URL: {url}")
print(f"📧 Email: {data['email']}")
print(f"🔑 Password: {data['password']}\n")

try:
    response = requests.post(url, json=data)
    
    print(f"📊 Status Code: {response.status_code}")
    print(f"📄 Response:\n")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    
    if response.status_code == 200:
        print("\n✅ LOGIN RÉUSSI!")
        print("🎉 Le problème est résolu!")
    else:
        print("\n❌ LOGIN ÉCHOUÉ")
        print(f"Erreur: {response.json()}")
        
except Exception as e:
    print(f"\n❌ Erreur: {e}")
