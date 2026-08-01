import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.entreprises.models import Entreprise

total = Entreprise.objects.count()
publiees = Entreprise.objects.filter(statut='publiee').count()
en_attente = Entreprise.objects.filter(statut='en_attente').count()
brouillon = Entreprise.objects.filter(statut='brouillon').count()

print(f'📊 Statistiques Entreprises:')
print(f'Total: {total}')
print(f'Publiées: {publiees}')
print(f'En attente: {en_attente}')
print(f'Brouillon: {brouillon}')

if total == 0:
    print('\n⚠️  Aucune entreprise dans la base!')
    print('Créez une entreprise via le frontend (vendeur)')
