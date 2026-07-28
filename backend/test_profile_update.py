import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.users.serializers import UserSerializer

# Trouver un utilisateur
users = User.objects.all()
if users.exists():
    user = users.first()
    print(f"\n=== Test de mise à jour du profil ===")
    print(f"Utilisateur: {user.username}")
    print(f"Email: {user.email}")
    print(f"Type: {user.user_type}")
    
    # Test 1: Sérialisation de l'utilisateur
    print("\n--- Serializer (GET) ---")
    serializer = UserSerializer(user)
    print(f"Données: {serializer.data}")
    
    # Test 2: Mise à jour partielle (PATCH)
    print("\n--- Test PATCH (mise à jour partielle) ---")
    update_data = {
        'first_name': 'TestFirstName',
        'last_name': 'TestLastName',
        'phone': '+216 12345678',
        'city': 'Tunis',
        'region': 'Tunis'
    }
    print(f"Données envoyées: {update_data}")
    
    serializer = UserSerializer(user, data=update_data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print(f"✅ Mise à jour réussie!")
        print(f"Nouvelles données: {serializer.data}")
    else:
        print(f"❌ Erreurs de validation: {serializer.errors}")
    
else:
    print("Aucun utilisateur trouvé dans la base de données")
