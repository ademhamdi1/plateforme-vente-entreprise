import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

print("\n🔧 Création d'un superuser pour Django Admin...\n")

# Vérifier si admin existe déjà
admin_user = User.objects.filter(username='admin').first()

if admin_user:
    print("ℹ️  Un utilisateur 'admin' existe déjà")
    # Mettre à jour pour être sûr qu'il est superuser
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.is_active = True
    admin_user.user_type = 'admin'
    admin_user.set_password('admin1234')
    admin_user.save()
    print("✅ Superuser mis à jour")
else:
    # Créer nouveau superuser
    admin_user = User.objects.create_superuser(
        username='admin',
        email='admin@test.com',
        password='admin1234',
        first_name='Admin',
        last_name='Système'
    )
    admin_user.user_type = 'admin'
    admin_user.save()
    print("✅ Nouveau superuser créé")

print("\n" + "="*60)
print("🎉 SUPERUSER DJANGO ADMIN PRÊT!")
print("="*60)
print("\n📍 URL: http://localhost:8000/admin")
print("👤 Username: admin")
print("🔑 Password: admin1234")
print("\n" + "="*60)
