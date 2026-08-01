import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

print("\n🔍 Vérification des comptes utilisateurs...\n")

# Check all users
all_users = User.objects.all()
print(f"📊 Total utilisateurs dans la base: {all_users.count()}\n")

if all_users.count() == 0:
    print("❌ Aucun utilisateur trouvé!")
    print("💡 Création des comptes de test...\n")
    
    # Create admin
    admin = User.objects.create_user(
        email='admin@test.com',
        password='admin1234',
        nom='Admin',
        prenom='Système',
        telephone='71123456',
        user_type='admin',
        is_staff=True,
        is_superuser=True
    )
    print(f"✅ Admin créé: {admin.email}")
    
    # Create vendeur
    vendeur = User.objects.create_user(
        email='vendeur@test.com',
        password='test1234',
        nom='Vendeur',
        prenom='Test',
        telephone='71234567',
        user_type='vendeur'
    )
    print(f"✅ Vendeur créé: {vendeur.email}")
    
    # Create acheteur
    acheteur = User.objects.create_user(
        email='acheteur@test.com',
        password='test1234',
        nom='Acheteur',
        prenom='Test',
        telephone='71345678',
        user_type='acheteur'
    )
    print(f"✅ Acheteur créé: {acheteur.email}")
    
    print("\n🎉 Comptes de test créés avec succès!")
else:
    print("📋 Liste des utilisateurs:\n")
    for user in all_users:
        status = "✅ Actif" if user.is_active else "❌ Inactif"
        nom_complet = f"{user.first_name} {user.last_name}" if user.first_name else "N/A"
        print(f"{status} | {user.email} | Type: {user.user_type} | Nom: {nom_complet}")

print("\n" + "="*60)
print("🔑 IDENTIFIANTS DE CONNEXION:")
print("="*60)
print("\n👤 Admin:")
print("   Email:    admin@test.com")
print("   Password: admin1234")
print("\n👤 Vendeur:")
print("   Email:    vendeur@test.com")
print("   Password: test1234")
print("\n👤 Acheteur:")
print("   Email:    acheteur@test.com")
print("   Password: test1234")
print("\n" + "="*60)
