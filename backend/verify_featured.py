import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.entreprises.models import Entreprise
from django.utils import timezone

print("\n🔍 Vérification des entreprises mises en avant...\n")

# Get all featured enterprises
all_featured = Entreprise.objects.filter(est_mise_en_avant=True)
print(f"📊 Total entreprises avec flag 'mise en avant': {all_featured.count()}")

# Get active featured enterprises
active_featured = Entreprise.objects.filter(
    est_mise_en_avant=True,
    date_debut_mise_en_avant__lte=timezone.now(),
    date_fin_mise_en_avant__gte=timezone.now(),
    statut='publiee'
).order_by('-date_debut_mise_en_avant')[:6]

print(f"⭐ Entreprises featured ACTIVES: {active_featured.count()}\n")

if active_featured:
    for e in active_featured:
        duree_restante = (e.date_fin_mise_en_avant - timezone.now()).days
        print(f"✅ {e.nom}")
        print(f"   Secteur: {e.secteur}")
        print(f"   Début: {e.date_debut_mise_en_avant.strftime('%d/%m/%Y')}")
        print(f"   Fin: {e.date_fin_mise_en_avant.strftime('%d/%m/%Y')}")
        print(f"   Jours restants: {duree_restante}")
        print(f"   Status: {e.statut}")
        print()
    
    print(f"🎯 Ces {active_featured.count()} entreprises sont affichées sur la page d'accueil!")
else:
    print("❌ Aucune entreprise featured active")

print("\n✅ Vérification terminée!")
