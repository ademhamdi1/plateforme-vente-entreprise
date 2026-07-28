import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Supprimer l'ancien admin s'il existe
User.objects.filter(username='admin').delete()

# Créer un nouveau superutilisateur
admin = User.objects.create_superuser(
    username='admin',
    email='admin@entreprises.tn',
    password='admin123',
    first_name='Admin',
    last_name='Platform',
    user_type='admin'
)

print("Compte admin créé avec succès !")
print("\nIdentifiants de connexion :")
print("   URL : http://localhost:8000/admin")
print("   Username : admin")
print("   Password : admin123")
print("\nNote : Copiez exactement le mot de passe : admin123")
