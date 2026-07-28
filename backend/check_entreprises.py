import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.entreprises.models import Entreprise

entreprises = Entreprise.objects.all()
print(f"Nombre total d'entreprises: {entreprises.count()}")
print("\n" + "="*50)

for e in entreprises:
    print(f"✅ {e.nom}")
    print(f"   Statut: {e.statut}")
    print(f"   Slug: {e.slug}")
    print(f"   Prix: {e.prix_demande} TND")
    print(f"   Région: {e.region}")
    print()
