import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Créer l'utilisateur acheteur
try:
    user, created = User.objects.get_or_create(
        email='adem@gmail.com',
        defaults={
            'username': 'adem',
            'first_name': 'Adem',
            'last_name': 'Ben Ahmed',
            'user_type': 'acheteur',
            'phone': '+216 98 765 432',
            'city': 'Tunis',
            'region': 'Tunis',
            'is_active': True,
            'is_verified': True
        }
    )
    
    if created:
        user.set_password('adem123')
        user.save()
        print(f"✅ Utilisateur acheteur créé avec succès!")
        print(f"   Email: adem@gmail.com")
        print(f"   Password: adem123")
        print(f"   Type: Acheteur")
    else:
        # Mettre à jour le mot de passe si l'utilisateur existe déjà
        user.set_password('adem123')
        user.save()
        print(f"✅ Utilisateur existant - mot de passe mis à jour")
        print(f"   Email: adem@gmail.com")
        print(f"   Password: adem123")
        print(f"   Type: {user.get_user_type_display()}")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n🌐 Vous pouvez maintenant vous connecter sur:")
print("   http://localhost:3000/login")
