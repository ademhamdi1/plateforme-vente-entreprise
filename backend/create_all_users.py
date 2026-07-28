import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

users_to_create = [
    {
        'username': 'adem',
        'email': 'adem@gmail.com',
        'password': 'adem123',
        'first_name': 'Adem',
        'last_name': 'Ben Ali',
        'user_type': 'acheteur',
        'phone': '+216 71 111 222'
    },
    {
        'username': 'vendeur',
        'email': 'vendeur@entreprises.tn',
        'password': 'vendeur123',
        'first_name': 'Mohamed',
        'last_name': 'Vendeur',
        'user_type': 'vendeur',
        'phone': '+216 71 333 444'
    }
]

print("Creating users...")
print("=" * 50)

for user_data in users_to_create:
    try:
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name'],
            user_type=user_data['user_type'],
            phone=user_data['phone']
        )
        print(f"✅ User created: {user_data['username']}")
        print(f"   Email: {user_data['email']}")
        print(f"   Password: {user_data['password']}")
        print(f"   Type: {user_data['user_type']}")
        print()
    except Exception as e:
        print(f"❌ Error creating {user_data['username']}: {e}")
        print()

print("=" * 50)
print("All users created successfully!")
print()
print("Available login credentials:")
print("1. Admin: admin / admin123")
print("2. Acheteur: acheteur / test123")
print("3. Acheteur: adem / adem123")
print("4. Vendeur: vendeur / vendeur123")
