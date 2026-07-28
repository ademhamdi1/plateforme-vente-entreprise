#!/usr/bin/env python
"""Test direct de l'endpoint change-password"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth import get_user_model
from apps.users.views import ChangePasswordView

User = get_user_model()

# Créer une requête factory
factory = RequestFactory()

# Récupérer un utilisateur
user = User.objects.first()
if not user:
    print("❌ Aucun utilisateur trouvé!")
    exit(1)

print(f"✅ Utilisateur trouvé: {user.username}")

# Créer une requête POST
request = factory.post(
    '/api/users/change-password/',
    data={'old_password': 'wrong', 'new_password': 'test123456'},
    content_type='application/json'
)
request.user = user

# Appeler la vue
view = ChangePasswordView.as_view()
response = view(request)

print(f"✅ Vue exécutée avec succès!")
print(f"Status Code: {response.status_code}")
print(f"Réponse: {response.data}")
