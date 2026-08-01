import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

print("\n🔧 Correction du compte administrateur...\n")

# Find user with username 'admin' or email 'admin@test.com' or 'admin@example.com'
admin_users = User.objects.filter(username='admin') | User.objects.filter(email__icontains='admin')

if admin_users.exists():
    print(f"📋 {admin_users.count()} compte(s) admin trouvé(s):\n")
    for user in admin_users:
        print(f"   • Username: {user.username}")
        print(f"     Email: {user.email}")
        print(f"     Type: {user.user_type}")
        print(f"     Staff: {user.is_staff}")
        print(f"     Superuser: {user.is_superuser}")
        print()
    
    # Update the first one to be proper admin
    admin = admin_users.first()
    print(f"🔄 Mise à jour du compte: {admin.username}")
    
    admin.email = 'admin@test.com'
    admin.user_type = 'admin'
    admin.is_staff = True
    admin.is_superuser = True
    admin.is_active = True
    admin.set_password('admin1234')  # Important: reset password
    admin.save()
    
    print("✅ Compte admin mis à jour!")
else:
    # No admin found, create with unique username
    print("❌ Aucun compte admin trouvé")
    print("🆕 Création d'un nouveau compte admin...\n")
    
    admin = User.objects.create_user(
        username='admintest',
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
print("\n")
