import os
import django
from django.utils.text import slugify
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.entreprises.models import Entreprise
from apps.users.models import User

# Obtenir ou créer un utilisateur vendeur
try:
    vendeur = User.objects.filter(user_type='vendeur').first()
    if not vendeur:
        vendeur = User.objects.create_user(
            email='vendeur@entreprises.tn',
            password='vendeur123',
            nom='Vendeur',
            prenom='Test',
            user_type='vendeur',
            telephone='+216 71 123 456'
        )
        print(f"Vendeur créé : {vendeur.email}")
except Exception as e:
    print(f"Erreur lors de la création du vendeur : {e}")
    vendeur = User.objects.first()

# Liste de 5 entreprises à créer
entreprises_data = [
    {
        'nom': 'Restaurant Le Gourmet',
        'description': 'Restaurant gastronomique situé au cœur de Tunis, avec une clientèle fidèle et une réputation établie depuis 15 ans. Cuisine française et tunisienne fusion. Capacité de 80 couverts, terrasse extérieure, équipement moderne complet.',
        'region': 'tunis',
        'ville': 'Tunis Centre',
        'adresse': 'Avenue Habib Bourguiba',
        'prix_demande': Decimal('450000'),
        'chiffre_affaires': Decimal('350000'),
        'resultat_net': Decimal('85000'),
        'nombre_employes': 12,
        'annee_creation': 2008,
        'surface_local': Decimal('200'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Cuisine professionnelle équipée, four à pizza, chambres froides, mobilier complet, vaisselle et ustensiles',
        'points_forts': 'Excellente localisation, clientèle fidèle, équipe formée, licences en règle',
        'opportunites_developpement': 'Service de livraison à domicile, extension de la terrasse, organisation d\'événements privés',
        'statut': 'publiee',
        'est_mise_en_avant': True,
    },
    {
        'nom': 'Café Moderne',
        'description': 'Café-restaurant moderne avec une ambiance chaleureuse, situé à Sousse. Idéal pour petit-déjeuner, déjeuner et soirées. Wifi gratuit, espace de travail co-working. Clientèle variée de professionnels et étudiants.',
        'region': 'sousse',
        'ville': 'Sousse',
        'adresse': 'Avenue Mohamed V',
        'prix_demande': Decimal('280000'),
        'chiffre_affaires': Decimal('180000'),
        'resultat_net': Decimal('42000'),
        'nombre_employes': 8,
        'annee_creation': 2015,
        'surface_local': Decimal('120'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Machines à café professionnelles, réfrigérateurs, four, mobilier complet, système audio',
        'points_forts': 'Emplacement stratégique, parking à proximité, bail longue durée avantageux',
        'opportunites_developpement': 'Développement du segment co-working, pâtisserie maison, événements culturels',
        'statut': 'publiee',
        'est_mise_en_avant': True,
    },
    {
        'nom': 'Boutique Mode Élégance',
        'description': 'Boutique de vêtements et accessoires haut de gamme pour femmes. Marques internationales et locales. Clientèle aisée et fidèle. Excellent emplacement dans un centre commercial premium à Sfax.',
        'region': 'sfax',
        'ville': 'Sfax',
        'adresse': 'Centre Commercial Sfax City',
        'prix_demande': Decimal('320000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('95000'),
        'nombre_employes': 5,
        'annee_creation': 2012,
        'surface_local': Decimal('85'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Présentoirs, mannequins, miroirs, système de sécurité, caisse enregistreuse, climatisation',
        'points_forts': 'Marges élevées, stock de qualité, relations fournisseurs établies, pas de concurrence directe',
        'opportunites_developpement': 'E-commerce, expansion vers accessoires luxe, service de personal shopping',
        'statut': 'publiee',
        'est_mise_en_avant': False,
    },
    {
        'nom': 'Salon de Coiffure Prestige',
        'description': 'Salon de coiffure mixte moderne avec espace spa et soins esthétiques. Équipement haut de gamme, personnel qualifié. Situé à Ariana dans un quartier résidentiel dynamique avec forte densité de population.',
        'region': 'ariana',
        'ville': 'Ariana Ville',
        'adresse': 'Rue de la République',
        'prix_demande': Decimal('175000'),
        'chiffre_affaires': Decimal('95000'),
        'resultat_net': Decimal('28000'),
        'nombre_employes': 6,
        'annee_creation': 2016,
        'surface_local': Decimal('75'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Postes de coiffure, bacs de lavage, sèche-cheveux professionnels, fauteuils, produits de soin',
        'points_forts': 'Clientèle régulière, équipe stable et formée, produits de marque exclusive',
        'opportunites_developpement': 'Services de mariage et événements, vente de produits, extensions capillaires',
        'statut': 'publiee',
        'est_mise_en_avant': True,
    },
    {
        'nom': 'Garage Mécanique Auto Pro',
        'description': 'Garage de réparation automobile et entretien toutes marques. Équipement moderne de diagnostic électronique. Clientèle fidèle de particuliers et entreprises. Agrément assurances. Nabeul.',
        'region': 'nabeul',
        'ville': 'Nabeul',
        'adresse': 'Route de Hammamet',
        'prix_demande': Decimal('390000'),
        'chiffre_affaires': Decimal('285000'),
        'resultat_net': Decimal('72000'),
        'nombre_employes': 7,
        'annee_creation': 2010,
        'surface_local': Decimal('250'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Pont élévateur, machine de diagnostic, compresseur, outillage complet, stock de pièces',
        'points_forts': 'Agrément assurances, contrats entreprises, mécaniciens expérimentés, bon emplacement',
        'opportunites_developpement': 'Vente de pièces détachées, service rapide express, partenariat avec concessionnaires',
        'statut': 'publiee',
        'est_mise_en_avant': False,
    },
]

# Créer les entreprises
created_count = 0
for data in entreprises_data:
    try:
        # Générer un slug unique
        base_slug = slugify(data['nom'])
        slug = base_slug
        counter = 1
        while Entreprise.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        data['slug'] = slug
        data['vendeur'] = vendeur
        
        entreprise = Entreprise.objects.create(**data)
        created_count += 1
        print(f"✅ Entreprise créée : {entreprise.nom} (slug: {entreprise.slug})")
        
    except Exception as e:
        print(f"❌ Erreur lors de la création de {data['nom']} : {e}")

print(f"\n✨ {created_count} entreprises créées avec succès sur 5 !")
print("\n📋 Vous pouvez les voir sur :")
print("   - Frontend : http://localhost:3000/entreprises")
print("   - Admin : http://localhost:8000/admin/entreprises/entreprise/")
