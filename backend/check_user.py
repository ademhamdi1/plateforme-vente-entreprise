import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Vérifier l'utilisateur
try:
    user = User.objects.get(email='adem@gmail.com')
    print(f"✅ Utilisateur trouvé:")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Type: {user.get_user_type_display()}")
    print(f"   Active: {user.is_active}")
    print(f"   Verified: {user.is_verified}")
    
    # Tester le mot de passe
    if user.check_password('adem123'):
        print(f"   ✅ Mot de passe correct!")
    else:
        print(f"   ❌ Mot de passe incorrect - Réinitialisation...")
        user.set_password('adem123')
        user.save()
        print(f"   ✅ Mot de passe réinitialisé!")
        
except User.DoesNotExist:
    print(f"❌ Utilisateur non trouvé")
    print(f"\nCréation de l'utilisateur...")
    
    user = User.objects.create_user(
        username='adem',
        email='adem@gmail.com',
        password='adem123',
        first_name='Adem',
        last_name='Ben Ahmed',
        user_type='acheteur',
        phone='+216 98 765 432',
        city='Tunis',
        region='Tunis',
        is_active=True,
        is_verified=True
    )
    print(f"✅ Utilisateur créé avec succès!")

print("\n📊 Tous les utilisateurs:")
for u in User.objects.all():
    print(f"   - {u.username} ({u.email}) - {u.get_user_type_display()}")
