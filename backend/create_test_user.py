import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Créer un utilisateur acheteur
try:
    user = User.objects.create_user(
        username='acheteur',
        email='acheteur@test.com',
        password='test123',
        first_name='Test',
        last_name='Acheteur',
        user_type='acheteur',
        phone='+216 71 123 456'
    )
    print(f"✅ Utilisateur créé avec succès!")
    print(f"   Username: acheteur")
    print(f"   Email: acheteur@test.com")
    print(f"   Password: test123")
    print(f"   Type: Acheteur")
except Exception as e:
    print(f"❌ Erreur: {e}")
    print("   L'utilisateur existe peut-être déjà.")
