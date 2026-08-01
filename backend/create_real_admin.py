import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

print("\n🔧 Création du compte administrateur...\n")

# Check if admin@test.com exists
if User.objects.filter(email='admin@test.com').exists():
    print("ℹ️  Le compte admin@test.com existe déjà")
    admin = User.objects.get(email='admin@test.com')
    # Update to make sure it's admin
    admin.user_type = 'admin'
    admin.is_staff = True
    admin.is_superuser = True
    admin.is_active = True
    admin.save()
    print("✅ Compte admin mis à jour")
else:
    # Create new admin
    admin = User.objects.create_user(
        username='admin',
        email='admin@test.com',
        password='admin1234',
        first_name='Admin',
        last_name='Système',
        phone='71123456',
        user_type='admin',
        is_staff=True,
        is_superuser=True,
        is_active=True
    )
    print("✅ Nouveau compte admin créé!")

print("\n" + "="*60)
print("🎉 COMPTE ADMINISTRATEUR PRÊT!")
print("="*60)
print("\n📧 Email:    admin@test.com")
print("🔑 Password: admin1234")
print("👤 Type:     admin")
print("✅ Status:   Actif")
print("\n" + "="*60)
print("\n💡 Vous pouvez maintenant vous connecter sur http://localhost:3000/login")
