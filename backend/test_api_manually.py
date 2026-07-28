#!/usr/bin/env python
"""
Script pour tester manuellement l'API de changement de mot de passe
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:8000/api"
USERNAME = "adem"
PASSWORD = "Azerty123"  # Remplacez par le vrai mot de passe

print("=== Test de l'API de changement de mot de passe ===\n")

# Étape 1: Login
print("1. Login...")
login_response = requests.post(
    f"{BASE_URL}/users/login/",
    json={"username": USERNAME, "password": PASSWORD}
)

if login_response.status_code == 200:
    tokens = login_response.json()
    access_token = tokens.get('access')
    print(f"✅ Login réussi!")
    print(f"Token: {access_token[:50]}...\n")
    
    # Étape 2: Vérifier le profil
    print("2. Récupération du profil...")
    headers = {"Authorization": f"Bearer {access_token}"}
    profile_response = requests.get(f"{BASE_URL}/users/profile/", headers=headers)
    
    if profile_response.status_code == 200:
        profile = profile_response.json()
        print(f"✅ Profil récupéré:")
        print(f"   - Username: {profile.get('username')}")
        print(f"   - Email: {profile.get('email')}")
        print(f"   - Type: {profile.get('user_type')}\n")
        
        # Étape 3: Test changement de mot de passe avec mot de passe incorrect
        print("3. Test avec ancien mot de passe INCORRECT...")
        change_response = requests.post(
            f"{BASE_URL}/users/change-password/",
            headers=headers,
            json={
                "old_password": "MotDePasseIncorrect123",
                "new_password": "NouveauMotDePasse123"
            }
        )
        print(f"   Status: {change_response.status_code}")
        print(f"   Réponse: {change_response.json()}\n")
        
        # Étape 4: Test changement avec mot de passe trop court
        print("4. Test avec nouveau mot de passe trop court...")
        change_response = requests.post(
            f"{BASE_URL}/users/change-password/",
            headers=headers,
            json={
                "old_password": PASSWORD,
                "new_password": "123"
            }
        )
        print(f"   Status: {change_response.status_code}")
        print(f"   Réponse: {change_response.json()}\n")
        
        # Étape 5: Test réussi (mais on annule immédiatement)
        print("5. Test avec des données valides...")
        new_test_password = "TestPassword123"
        change_response = requests.post(
            f"{BASE_URL}/users/change-password/",
            headers=headers,
            json={
                "old_password": PASSWORD,
                "new_password": new_test_password
            }
        )
        print(f"   Status: {change_response.status_code}")
        print(f"   Réponse: {change_response.json()}")
        
        if change_response.status_code == 200:
            print(f"\n   ⚠️  Changement réussi! Restauration de l'ancien mot de passe...")
            # Restaurer l'ancien mot de passe
            restore_response = requests.post(
                f"{BASE_URL}/users/change-password/",
                headers=headers,
                json={
                    "old_password": new_test_password,
                    "new_password": PASSWORD
                }
            )
            if restore_response.status_code == 200:
                print(f"   ✅ Mot de passe restauré!")
            else:
                print(f"   ❌ Échec de la restauration: {restore_response.json()}")
    else:
        print(f"❌ Erreur profil: {profile_response.status_code}")
        print(f"   Réponse: {profile_response.text}")
        
else:
    print(f"❌ Échec du login: {login_response.status_code}")
    print(f"   Réponse: {login_response.text}")
    print(f"\n⚠️  Vérifiez le USERNAME et PASSWORD dans le script!")
