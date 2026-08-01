import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.entreprises.models import Entreprise
from django.utils import timezone
from datetime import timedelta

print("🌟 Mise en avant d'entreprises de test...")

# Récupérer les entreprises publiées
entreprises_publiees = Entreprise.objects.filter(statut='publiee').order_by('-created_at')[:6]

if not entreprises_publiees:
    print("❌ Aucune entreprise publiée trouvée")
    print("💡 Exécutez d'abord: python create_test_data.py")
else:
    count = 0
    for i, entreprise in enumerate(entreprises_publiees):
        # Varier les durées de mise en avant
        durees = [7, 15, 30, 60, 90, 30]
        duree = durees[i]
        
        entreprise.est_mise_en_avant = True
        entreprise.date_debut_mise_en_avant = timezone.now()
        entreprise.date_fin_mise_en_avant = timezone.now() + timedelta(days=duree)
        entreprise.save()
        
        count += 1
        print(f"✅ {entreprise.nom} - mise en avant pour {duree} jours")
        print(f"   Début: {entreprise.date_debut_mise_en_avant.strftime('%d/%m/%Y')}")
        print(f"   Fin: {entreprise.date_fin_mise_en_avant.strftime('%d/%m/%Y')}")
    
    print(f"\n🎉 {count} entreprises mises en avant avec succès dans PostgreSQL!")
    print(f"📍 Visibles sur la page d'accueil dans la section 'Entreprises Mises en Avant'")
