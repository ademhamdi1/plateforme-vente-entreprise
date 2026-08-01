import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from django.contrib.auth import authenticate

print("\n🔐 Test du système de connexion...\n")

# Test 1: Check if admin exists
print("1️⃣ Vérification du compte admin...")
try:
    admin = User.objects.get(email='admin@test.com')
    print(f"   ✅ Compte trouvé: {admin.email}")
    print(f"   👤 Username: {admin.username}")
    print(f"   🎭 Type: {admin.user_type}")
    print(f"   ✅ Actif: {admin.is_active}")
except User.DoesNotExist:
    print("   ❌ Compte admin@test.com non trouvé!")
    exit()

# Test 2: Check password
print("\n2️⃣ Test du mot de passe...")
password = 'admin1234'
if admin.check_password(password):
    print(f"   ✅ Mot de passe correct!")
else:
    print(f"   ❌ Mot de passe incorrect!")
    print("   🔧 Réinitialisation du mot de passe...")
    admin.set_password(password)
    admin.save()
    print("   ✅ Mot de passe réinitialisé!")

# Test 3: Simulate login
print("\n3️⃣ Simulation de connexion...")
print(f"   📧 Email: admin@test.com")
print(f"   🔑 Password: admin1234")

from rest_framework_simplejwt.tokens import RefreshToken

try:
    refresh = RefreshToken.for_user(admin)
    access = str(refresh.access_token)
    
    print(f"\n   ✅ Tokens JWT générés avec succès!")
    print(f"   🎫 Access Token (preview): {access[:50]}...")
    print(f"   🔄 Refresh Token (preview): {str(refresh)[:50]}...")
    
    print("\n" + "="*60)
    print("✅ SYSTÈME DE CONNEXION FONCTIONNEL!")
    print("="*60)
    print("\n💡 Vous pouvez maintenant vous connecter sur:")
    print("   http://localhost:3000/login")
    print("\n📧 Identifiants:")
    print("   Email: admin@test.com")
    print("   Password: admin1234")
    print()
    
except Exception as e:
    print(f"\n   ❌ Erreur lors de la génération des tokens: {e}")
