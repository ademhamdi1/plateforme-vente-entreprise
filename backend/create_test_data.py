import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.entreprises.models import Entreprise
from django.utils import timezone

# Create or get test vendeur
vendeur, created = User.objects.get_or_create(
    email='vendeur@test.com',
    defaults={
        'username': 'vendeur_test',
        'first_name': 'Mohamed',
        'last_name': 'Ben Ali',
        'user_type': 'vendeur',
        'phone': '20123456',
    }
)
if created:
    vendeur.set_password('test1234')
    vendeur.save()
    print('✅ Vendeur créé: vendeur@test.com / test1234')
else:
    print('✅ Vendeur existant: vendeur@test.com')

# Create test entreprises
entreprises_data = [
    {
        'nom': 'Restaurant Le Gourmet',
        'description': 'Restaurant gastronomique situé au coeur de Tunis, spécialisé dans la cuisine tunisienne moderne. Clientèle fidèle et locale premium.',
        'secteur': 'tourisme',
        'region': 'tunis',
        'ville': 'Tunis',
        'prix_demande': Decimal('450000'),
        'chiffre_affaires': Decimal('280000'),
        'resultat_net': Decimal('85000'),
        'nombre_employes': 12,
        'annee_creation': 2018,
        'type_transaction': 'vente_totale',
        'statut': 'publiee',
        'published_at': timezone.now(),
    },
    {
        'nom': 'Café La Rose',
        'description': 'Café moderne avec terrasse, situé à Sousse. Très bon emplacement touristique avec vue mer. Équipement complet et récent.',
        'secteur': 'tourisme',
        'region': 'sousse',
        'ville': 'Sousse',
        'prix_demande': Decimal('320000'),
        'chiffre_affaires': Decimal('180000'),
        'resultat_net': Decimal('52000'),
        'nombre_employes': 8,
        'annee_creation': 2019,
        'type_transaction': 'vente_totale',
        'statut': 'publiee',
        'published_at': timezone.now(),
    },
    {
        'nom': 'Société de Développement Web',
        'description': 'Agence de développement web et mobile établie depuis 2015. Portfolio de 50+ clients. Stack moderne (React, Node.js, Python).',
        'secteur': 'informatique',
        'region': 'ariana',
        'ville': 'Ariana',
        'prix_demande': Decimal('580000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('125000'),
        'nombre_employes': 15,
        'annee_creation': 2015,
        'type_transaction': 'vente_partielle',
        'statut': 'publiee',
        'published_at': timezone.now(),
    },
    {
        'nom': 'Boulangerie Patisserie Moderne',
        'description': 'Boulangerie-pâtisserie artisanale à Sfax. Production quotidienne de pains et pâtisseries. Local commercial de 120m².',
        'secteur': 'commerce',
        'region': 'sfax',
        'ville': 'Sfax',
        'prix_demande': Decimal('280000'),
        'chiffre_affaires': Decimal('150000'),
        'resultat_net': Decimal('45000'),
        'nombre_employes': 6,
        'annee_creation': 2017,
        'type_transaction': 'vente_totale',
        'statut': 'publiee',
        'published_at': timezone.now(),
    },
    {
        'nom': 'Centre de Formation Informatique',
        'description': 'Centre de formation spécialisé en informatique et nouvelles technologies. Agréé par l\'État. 200+ étudiants par an.',
        'secteur': 'education',
        'region': 'nabeul',
        'ville': 'Nabeul',
        'prix_demande': Decimal('390000'),
        'chiffre_affaires': Decimal('220000'),
        'resultat_net': Decimal('68000'),
        'nombre_employes': 10,
        'annee_creation': 2016,
        'type_transaction': 'recherche_associe',
        'statut': 'publiee',
        'published_at': timezone.now(),
    },
]

# Create entreprises
created_count = 0
for data in entreprises_data:
    entreprise, created = Entreprise.objects.get_or_create(
        nom=data['nom'],
        vendeur=vendeur,
        defaults=data
    )
    if created:
        created_count += 1
        print(f'✅ Créé: {entreprise.nom} ({entreprise.secteur})')
    else:
        print(f'⏭️  Existe: {entreprise.nom}')

print(f'\n🎉 {created_count} entreprise(s) créée(s)!')
print(f'📊 Total dans la base: {Entreprise.objects.count()}')
print(f'🌐 Publiées: {Entreprise.objects.filter(statut="publiee").count()}')
