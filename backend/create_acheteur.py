import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Créer un compte acheteur de test
acheteur, created = User.objects.get_or_create(
    username='acheteur',
    email='acheteur@test.com',
    defaults={
        'first_name': 'Jean',
        'last_name': 'Acheteur',
        'user_type': 'acheteur',
        'phone': '+216 20 123 456',
        'city': 'Tunis',
        'region': 'tunis',
        'is_verified': True,
    }
)

if created:
    acheteur.set_password('test1234')
    acheteur.save()
    print("✅ Compte acheteur créé avec succès!")
else:
    print("ℹ️  Compte acheteur existe déjà")

print(f"   Email: acheteur@test.com")
print(f"   Password: test1234")
print(f"   Type: {acheteur.user_type}")
