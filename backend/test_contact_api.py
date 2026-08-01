"""
Test API endpoint pour le formulaire de contact
"""
import requests
import json

API_URL = 'http://localhost:8000/api'

def test_contact_api():
    print("=" * 60)
    print("TEST: API Contact Form")
    print("=" * 60)
    
    # Données de test
    test_data = {
        'nom': 'Jean Dupont',
        'email': 'jean.dupont@example.com',
        'sujet': 'question',
        'message': 'Bonjour, j\'aimerais avoir plus d\'informations sur votre plateforme. Comment puis-je publier une entreprise?'
    }
    
    print("\n📤 Envoi du message de test...")
    print(f"Nom: {test_data['nom']}")
    print(f"Email: {test_data['email']}")
    print(f"Sujet: {test_data['sujet']}")
    print(f"Message: {test_data['message'][:50]}...")
    
    try:
        response = requests.post(
            f'{API_URL}/users/contact/',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n📥 Réponse du serveur:")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"\n✅ SUCCESS! Message envoyé avec succès!")
            print(f"Message serveur: {data.get('message', 'N/A')}")
            if 'data' in data:
                print(f"\nDétails du message créé:")
                print(f"  ID: {data['data'].get('id', 'N/A')}")
                print(f"  Statut: {data['data'].get('statut', 'N/A')}")
                print(f"  Date création: {data['data'].get('created_at', 'N/A')}")
        else:
            print(f"\n❌ ERREUR! Code: {response.status_code}")
            print(f"Réponse: {response.text}")
    
    except requests.exceptions.ConnectionError:
        print("\n❌ ERREUR: Impossible de se connecter au serveur")
        print("Vérifiez que le backend est démarré sur http://localhost:8000")
    except Exception as e:
        print(f"\n❌ ERREUR: {str(e)}")
    
    print("\n" + "=" * 60)
    print("Test terminé!")
    print("=" * 60)
    
    # Vérifier dans la base de données
    print("\n🔍 Vérification dans la base de données...")
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    
    from apps.users.models import ContactMessage
    total = ContactMessage.objects.count()
    print(f"Total messages dans la DB: {total}")
    
    if total > 0:
        last_message = ContactMessage.objects.latest('created_at')
        print(f"\nDernier message:")
        print(f"  De: {last_message.nom} ({last_message.email})")
        print(f"  Sujet: {last_message.get_sujet_display()}")
        print(f"  Statut: {last_message.get_statut_display()}")
        print(f"  Date: {last_message.created_at.strftime('%d/%m/%Y %H:%M:%S')}")

if __name__ == '__main__':
    test_contact_api()
