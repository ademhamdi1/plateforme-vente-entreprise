import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.categories.models import Category
from apps.entreprises.models import Entreprise
from apps.subscriptions.models import Plan
from django.utils.text import slugify
from datetime import datetime

print("Création des données professionnelles...\n")

# 1. Créer des catégories professionnelles
print("Création des catégories...")
categories_data = [
    {'name': 'Industrie', 'slug': 'industrie', 'description': 'Entreprises de fabrication et production industrielle', 'icon': '', 'order': 1},
    {'name': 'Services', 'slug': 'services', 'description': 'Entreprises de services aux particuliers et professionnels', 'icon': '', 'order': 2},
    {'name': 'Commerce', 'slug': 'commerce', 'description': 'Commerce de détail et de gros', 'icon': '', 'order': 3},
    {'name': 'Restauration', 'slug': 'restauration', 'description': 'Restaurants, cafés, fast-food', 'icon': '', 'order': 4},
    {'name': 'Tourisme & Hôtellerie', 'slug': 'tourisme-hotellerie', 'description': 'Hôtels, maisons d\'hôtes, agences de voyage', 'icon': '', 'order': 5},
    {'name': 'Transport & Logistique', 'slug': 'transport-logistique', 'description': 'Transport de marchandises et personnes', 'icon': '', 'order': 6},
    {'name': 'Santé', 'slug': 'sante', 'description': 'Cliniques, cabinets médicaux, laboratoires', 'icon': '', 'order': 7},
    {'name': 'Technologies & IT', 'slug': 'technologies-it', 'description': 'Développement logiciel, services IT', 'icon': '', 'order': 8},
    {'name': 'Agriculture', 'slug': 'agriculture', 'description': 'Agriculture, élevage, pêche', 'icon': '', 'order': 9},
    {'name': 'BTP & Construction', 'slug': 'btp-construction', 'description': 'Bâtiment, travaux publics', 'icon': '', 'order': 10},
    {'name': 'Franchise', 'slug': 'franchise', 'description': 'Opportunités de franchise', 'icon': '', 'order': 11},
    {'name': 'Startups', 'slug': 'startups', 'description': 'Jeunes entreprises innovantes', 'icon': '', 'order': 12},
]

categories = {}
for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        slug=cat_data['slug'],
        defaults=cat_data
    )
    categories[cat_data['slug']] = category
    status = "Créée" if created else "Existe"
    print(f"   {status} : {category.name}")

# 2. Créer des utilisateurs vendeurs professionnels
print("\nCréation des utilisateurs vendeurs...")
vendeurs_data = [
    {'username': 'mohamed_ben_ali', 'email': 'mohamed@example.tn', 'first_name': 'Mohamed', 'last_name': 'Ben Ali', 'phone': '+216 98 123 456'},
    {'username': 'fatma_trabelsi', 'email': 'fatma@example.tn', 'first_name': 'Fatma', 'last_name': 'Trabelsi', 'phone': '+216 97 234 567'},
    {'username': 'karim_sassi', 'email': 'karim@example.tn', 'first_name': 'Karim', 'last_name': 'Sassi', 'phone': '+216 96 345 678'},
    {'username': 'leila_jmal', 'email': 'leila@example.tn', 'first_name': 'Leila', 'last_name': 'Jmal', 'phone': '+216 95 456 789'},
]

vendeurs = []
for vendeur_data in vendeurs_data:
    user, created = User.objects.get_or_create(
        username=vendeur_data['username'],
        defaults={
            **vendeur_data,
            'user_type': 'vendeur',
            'is_verified': True
        }
    )
    if created:
        user.set_password('password123')
        user.save()
    vendeurs.append(user)
    status = "Créé" if created else "Existe"
    print(f"   {status} : {user.get_full_name()}")

# 3. Créer des entreprises professionnelles
print("\nCréation des entreprises...")
entreprises_data = [
    {
        'nom': 'Restaurant Le Gourmet',
        'category': 'restauration',
        'description': '''Restaurant gastronomique situé au cœur de La Marsa avec une capacité de 80 couverts. 
Cuisine française et tunisienne fusion. Clientèle fidèle et haut de gamme. 
Équipement professionnel complet récemment rénové. Terrasse extérieure avec vue mer.
Personnel qualifié en place (8 employés dont 2 chefs cuisiniers).''',
        'region': 'tunis',
        'ville': 'La Marsa',
        'prix_demande': Decimal('450000'),
        'chiffre_affaires': Decimal('380000'),
        'resultat_net': Decimal('85000'),
        'valeur_actifs': Decimal('320000'),
        'endettement': Decimal('50000'),
        'nombre_employes': 8,
        'annee_creation': 2015,
        'surface_local': Decimal('200'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Emplacement premium, clientèle fidèle, équipement neuf, licence restaurant',
        'opportunites_developpement': 'Service traiteur, événements privés, extension terrasse',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 245
    },
    {
        'nom': 'Cabinet Médical Specialized',
        'category': 'sante',
        'description': '''Cabinet médical spécialisé en cardiologie situé dans le centre de Sfax.
Clientèle établie de plus de 2000 patients. Équipement médical moderne incluant ECG, échographie cardiaque.
Contrats avec plusieurs mutuelles et assurances. Locaux spacieux et bien aménagés.
Possibilité de continuer à travailler avec le nouveau propriétaire pendant la transition.''',
        'region': 'sfax',
        'ville': 'Sfax Centre',
        'prix_demande': Decimal('280000'),
        'chiffre_affaires': Decimal('195000'),
        'resultat_net': Decimal('92000'),
        'valeur_actifs': Decimal('150000'),
        'nombre_employes': 3,
        'annee_creation': 2012,
        'surface_local': Decimal('120'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Réputation établie, base patients large, équipement récent',
        'opportunites_developpement': 'Extension services, télémédecine, partenariats cliniques',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 189
    },
    {
        'nom': 'Agence Web Solutions Plus',
        'category': 'technologies-it',
        'description': '''Agence de développement web et mobile établie depuis 2018.
Portfolio de 50+ clients actifs incluant grandes entreprises tunisiennes et internationales.
Équipe de 12 développeurs qualifiés (Full-stack, Mobile, DevOps).
Contrats récurrents garantissant revenu stable. Technologies modernes (React, Node.js, Flutter).
Bureau moderne équipé, culture d\'entreprise forte.''',
        'region': 'tunis',
        'ville': 'Berges du Lac',
        'prix_demande': Decimal('520000'),
        'chiffre_affaires': Decimal('485000'),
        'resultat_net': Decimal('125000'),
        'valeur_actifs': Decimal('180000'),
        'nombre_employes': 12,
        'annee_creation': 2018,
        'surface_local': Decimal('180'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Équipe solide, clients fidèles, contrats récurrents, croissance 30%/an',
        'opportunites_developpement': 'IA/ML, Cloud services, expansion internationale',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 312
    },
    {
        'nom': 'Hôtel Résidence El Mouradi',
        'category': 'tourisme-hotellerie',
        'description': '''Hôtel 3 étoiles de 24 chambres situé à Hammamet Nord.
À 300m de la plage. Piscine, restaurant, bar. Occupation moyenne 75%.
Personnel expérimenté en place. Licence touristique catégorie A.
Partenariats avec agences de voyage locales et internationales.
Bâtiment en excellent état, récemment rénové (2020).''',
        'region': 'nabeul',
        'ville': 'Hammamet',
        'prix_demande': Decimal('1850000'),
        'chiffre_affaires': Decimal('680000'),
        'resultat_net': Decimal('195000'),
        'valeur_actifs': Decimal('2100000'),
        'endettement': Decimal('450000'),
        'nombre_employes': 18,
        'annee_creation': 2005,
        'surface_local': Decimal('1200'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Emplacement stratégique, licence catégorie A, taux occupation élevé',
        'opportunites_developpement': 'Extension 10 chambres, spa, séminaires entreprise',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 456
    },
    {
        'nom': 'Superette Moderne Carthage',
        'category': 'commerce',
        'description': '''Superette bien établie dans quartier résidentiel haut standing de Carthage.
Surface de vente 150m². Chiffre d\'affaires stable et croissant.
Clientèle fidèle du quartier. Emplacement stratégique avec parking.
Stock fourni. Contrat de bail avantageux (8 ans restants).
Système de gestion informatisé. Équipement frigorifique récent.''',
        'region': 'tunis',
        'ville': 'Carthage',
        'prix_demande': Decimal('185000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('58000'),
        'valeur_actifs': Decimal('95000'),
        'nombre_employes': 4,
        'annee_creation': 2016,
        'surface_local': Decimal('150'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Quartier haut standing, bail long terme, clientèle fidèle',
        'opportunites_developpement': 'Livraison à domicile, produits bio, e-commerce',
        'statut': 'publiee',
        'nombre_vues': 167
    },
    {
        'nom': 'Société Transport Express',
        'category': 'transport-logistique',
        'description': '''Entreprise de transport de marchandises avec flotte de 8 camions.
Contrats réguliers avec grandes entreprises industrielles.
Autorisation de transport national. Personnel qualifié.
Garage et entrepôt inclus (400m²). Système GPS tracking.
Maintenance régulière documentée. Croissance continue depuis 5 ans.''',
        'region': 'sousse',
        'ville': 'Sousse',
        'prix_demande': Decimal('650000'),
        'chiffre_affaires': Decimal('580000'),
        'resultat_net': Decimal('98000'),
        'valeur_actifs': Decimal('720000'),
        'endettement': Decimal('180000'),
        'nombre_employes': 12,
        'annee_creation': 2013,
        'surface_local': Decimal('400'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Flotte récente, contrats long terme, autorisations complètes',
        'opportunites_developpement': 'Transport international, logistique e-commerce',
        'statut': 'publiee',
        'nombre_vues': 198
    },
    {
        'nom': 'Startup Fintech InnovatePay',
        'category': 'startups',
        'description': '''Startup fintech développant solution de paiement mobile innovante.
Application lancée avec 15,000 utilisateurs actifs en 6 mois.
Équipe technique de 8 personnes (développeurs, designers, marketing).
Partenariat en cours avec 2 banques tunisiennes.
Recherche investisseur stratégique pour scaling.''',
        'region': 'tunis',
        'ville': 'El Menzah',
        'prix_demande': Decimal('380000'),
        'chiffre_affaires': Decimal('45000'),
        'resultat_net': Decimal('-25000'),
        'nombre_employes': 8,
        'annee_creation': 2023,
        'surface_local': Decimal('100'),
        'type_transaction': 'levee_fonds',
        'points_forts': 'Croissance utilisateurs rapide, équipe solide, technologie propriétaire',
        'opportunites_developpement': 'Expansion régionale, services additionnels, B2B',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 287
    },
    {
        'nom': 'Boulangerie Pâtisserie Artisanale',
        'category': 'commerce',
        'description': '''Boulangerie-pâtisserie artisanale réputée depuis 20 ans.
Production quotidienne de pain traditionnel et pâtisseries fines.
Clientèle très fidèle. Emplacement central avec passage important.
Équipement professionnel complet en excellent état.
Recettes traditionnelles familiales incluses.''',
        'region': 'ariana',
        'ville': 'Ariana Centre',
        'prix_demande': Decimal('195000'),
        'chiffre_affaires': Decimal('285000'),
        'resultat_net': Decimal('62000'),
        'valeur_actifs': Decimal('110000'),
        'nombre_employes': 6,
        'annee_creation': 2004,
        'surface_local': Decimal('85'),
        'type_transaction': 'vente_totale',
        'points_forts': 'Réputation établie, emplacement premium, clientèle fidèle',
        'opportunites_developpement': 'Livraison entreprises, gâteaux personnalisés, salon de thé',
        'statut': 'publiee',
        'nombre_vues': 142
    }
]

for idx, entr_data in enumerate(entreprises_data):
    category = categories[entr_data.pop('category')]
    vendeur = vendeurs[idx % len(vendeurs)]
    
    entreprise, created = Entreprise.objects.get_or_create(
        slug=slugify(entr_data['nom']),
        defaults={
            **entr_data,
            'category': category,
            'vendeur': vendeur
        }
    )
    status = "Créée" if created else "Existe"
    print(f"   {status} : {entreprise.nom} - {entreprise.prix_demande} TND")

# 4. Créer les plans d'abonnement professionnels
print("\nCréation des plans d'abonnement...")
plans_data = [
    {
        'name': 'Gratuit',
        'slug': 'gratuit',
        'description': 'Idéal pour tester la plateforme',
        'price': Decimal('0'),
        'duration_days': 30,
        'max_annonces': 1,
        'mise_en_avant': False,
        'statistiques_avancees': False,
        'support_prioritaire': False,
        'badge_verifie': False,
        'publicite_premium': False,
        'accompagnement_personnalise': False,
        'order': 1
    },
    {
        'name': 'Premium',
        'slug': 'premium',
        'description': 'Pour les vendeurs actifs',
        'price': Decimal('99'),
        'duration_days': 30,
        'max_annonces': 5,
        'mise_en_avant': True,
        'statistiques_avancees': True,
        'support_prioritaire': True,
        'badge_verifie': False,
        'publicite_premium': False,
        'accompagnement_personnalise': False,
        'order': 2
    },
    {
        'name': 'Professionnel',
        'slug': 'professionnel',
        'description': 'Solution complète pour professionnels',
        'price': Decimal('249'),
        'duration_days': 30,
        'max_annonces': 999,
        'mise_en_avant': True,
        'statistiques_avancees': True,
        'support_prioritaire': True,
        'badge_verifie': True,
        'publicite_premium': True,
        'accompagnement_personnalise': True,
        'order': 3
    }
]

for plan_data in plans_data:
    plan, created = Plan.objects.get_or_create(
        slug=plan_data['slug'],
        defaults=plan_data
    )
    status = "Créé" if created else "Existe"
    print(f"   {status} : {plan.name} - {plan.price} TND/mois")

print("\n" + "="*60)
print("DONNÉES PROFESSIONNELLES CRÉÉES AVEC SUCCÈS !")
print("="*60)
print(f"\nRésumé :")
print(f"   {len(categories_data)} catégories")
print(f"   {len(vendeurs_data)} vendeurs")
print(f"   {len(entreprises_data)} entreprises")
print(f"   {len(plans_data)} plans d'abonnement")

print(f"\nAccès Admin :")
print(f"   URL : http://localhost:8000/admin")
print(f"   Username : admin")
print(f"   Password : admin123")

print(f"\nAutres URLs :")
print(f"   Swagger : http://localhost:8000/swagger/")
print(f"   ReDoc : http://localhost:8000/redoc/")
print(f"   API Entreprises : http://localhost:8000/api/entreprises/")
print(f"   API Catégories : http://localhost:8000/api/categories/")

print("\nVotre plateforme est maintenant prête avec des données réalistes !")
