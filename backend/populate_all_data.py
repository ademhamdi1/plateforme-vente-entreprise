import os
import django
from decimal import Decimal
from django.utils.text import slugify

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.entreprises.models import Entreprise

print("=" * 70)
print("CRÉATION DE TOUTES LES DONNÉES POUR LA PLATEFORME")
print("=" * 70)

# Obtenir ou créer le vendeur
try:
    vendeur = User.objects.get(username='vendeur')
except User.DoesNotExist:
    vendeur = User.objects.create_user(
        username='vendeur',
        email='vendeur@entreprises.tn',
        password='vendeur123',
        first_name='Mohamed',
        last_name='Vendeur',
        user_type='vendeur',
        phone='+216 71 333 444'
    )
    print(f"✓ Vendeur créé: {vendeur.username}\n")

# Données complètes d'entreprises
entreprises_data = [
    {
        'nom': 'Restaurant Le Gourmet Tunis',
        'secteur': 'tourisme',
        'description': '''Restaurant gastronomique situé au cœur de La Marsa avec vue sur la mer. Capacité de 80 couverts.
Cuisine française et tunisienne fusion de haute qualité. Clientèle haut de gamme fidèle depuis 15 ans.
Équipement professionnel complet récemment rénové. Terrasse extérieure panoramique.
Personnel qualifié en place: 2 chefs cuisiniers diplômés, 6 serveurs expérimentés.''',
        'region': 'tunis',
        'ville': 'La Marsa',
        'adresse': 'Avenue Habib Bourguiba, La Marsa',
        'prix_demande': Decimal('450000'),
        'chiffre_affaires': Decimal('380000'),
        'resultat_net': Decimal('85000'),
        'valeur_actifs': Decimal('320000'),
        'endettement': Decimal('50000'),
        'nombre_employes': 8,
        'annee_creation': 2009,
        'surface_local': Decimal('200'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Cuisine professionnelle équipée, fours professionnels, chambres froides, mobilier haut de gamme',
        'points_forts': 'Emplacement premium vue mer, clientèle fidèle haut de gamme, équipement neuf, licence restaurant complète',
        'opportunites_developpement': 'Service traiteur premium, organisation événements privés, extension terrasse lounge',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 245
    },
    {
        'nom': 'Café Moderne Sousse',
        'secteur': 'tourisme',
        'description': '''Café-restaurant tendance dans le centre-ville de Sousse. Ambiance moderne et cosy.
Wifi gratuit, espace co-working. Clientèle variée: professionnels, étudiants, touristes.
Menu varié: petit-déjeuner, déjeuner, pâtisseries maison. Terrasse spacieuse.''',
        'region': 'sousse',
        'ville': 'Sousse Centre',
        'adresse': 'Avenue Mohamed V',
        'prix_demande': Decimal('280000'),
        'chiffre_affaires': Decimal('180000'),
        'resultat_net': Decimal('42000'),
        'nombre_employes': 6,
        'annee_creation': 2017,
        'surface_local': Decimal('120'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Machines à café professionnelles, réfrigérateurs, four pâtisserie, mobilier design',
        'points_forts': 'Emplacement central, parking proche, bail avantageux 10 ans',
        'opportunites_developpement': 'Expansion espace co-working, pâtisserie artisanale, événements culturels',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 189
    },
    {
        'nom': 'Boutique Mode Élégance Sfax',
        'secteur': 'commerce',
        'description': '''Boutique de vêtements et accessoires femme haut de gamme dans centre commercial premium.
Marques internationales et créateurs locaux. Clientèle aisée et très fidèle.
Stock de qualité valorisé à 85,000 TND inclus dans la vente.''',
        'region': 'sfax',
        'ville': 'Sfax Centre',
        'adresse': 'Centre Commercial Sfax City',
        'prix_demande': Decimal('320000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('95000'),
        'nombre_employes': 5,
        'annee_creation': 2014,
        'surface_local': Decimal('85'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Présentoirs design, mannequins, miroirs, système sécurité, caisse moderne',
        'points_forts': 'Marges élevées 45%, relations fournisseurs exclusives, pas de concurrence directe',
        'opportunites_developpement': 'E-commerce boutique en ligne, expansion accessoires luxe, personal shopping VIP',
        'statut': 'publiee',
        'nombre_vues': 167
    },
    {
        'nom': 'Agence Web Digital Solutions',
        'secteur': 'informatique',
        'description': '''Agence de développement web et applications mobiles établie. Portfolio de 50+ clients actifs.
Équipe de 12 développeurs qualifiés: Full-stack, Mobile iOS/Android, DevOps.
Contrats récurrents garantissant revenu stable. Technologies: React, Node.js, Flutter, AWS.
Bureau moderne 180m² aux Berges du Lac. Culture d'entreprise forte.''',
        'region': 'tunis',
        'ville': 'Berges du Lac',
        'adresse': 'Immeuble Platinum, Berges du Lac',
        'prix_demande': Decimal('520000'),
        'chiffre_affaires': Decimal('485000'),
        'resultat_net': Decimal('125000'),
        'valeur_actifs': Decimal('180000'),
        'nombre_employes': 12,
        'annee_creation': 2018,
        'surface_local': Decimal('180'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Workstations haut de gamme, serveurs, mobilier ergonomique, salle réunion équipée',
        'points_forts': 'Équipe solide fidèle, clients récurrents grandes entreprises, croissance 30%/an, processus ISO',
        'opportunites_developpement': 'Services IA/ML, solutions Cloud, expansion Maghreb et Afrique, produits SaaS',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 312
    },
    {
        'nom': 'Hôtel Résidence Hammamet',
        'secteur': 'tourisme',
        'description': '''Hôtel 3 étoiles de 24 chambres climatisées à Hammamet Nord, à 300m de la plage.
Piscine chauffée, restaurant 60 couverts, bar lounge. Taux occupation moyen 75%.
Personnel expérimenté stable. Licence touristique catégorie A.
Partenariats actifs avec agences de voyage européennes et tunisiennes.
Bâtiment excellent état, rénovation complète 2021.''',
        'region': 'nabeul',
        'ville': 'Hammamet',
        'adresse': 'Zone Touristique Hammamet Nord',
        'prix_demande': Decimal('1850000'),
        'chiffre_affaires': Decimal('680000'),
        'resultat_net': Decimal('195000'),
        'valeur_actifs': Decimal('2100000'),
        'endettement': Decimal('450000'),
        'nombre_employes': 18,
        'annee_creation': 2005,
        'surface_local': Decimal('1200'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Mobilier chambres complet, équipement cuisine industrielle, piscine, système climatisation central',
        'points_forts': 'Emplacement stratégique proche plage, licence A, taux occupation élevé 75%, réputation TripAdvisor 4.2/5',
        'opportunites_developpement': 'Extension +10 chambres possible, création spa wellness, séminaires entreprises',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 456
    },
    {
        'nom': 'Superette Carthage Premium',
        'secteur': 'commerce',
        'description': '''Superette bien achalandée quartier résidentiel haut standing Carthage Présidence.
Surface vente 150m². Chiffre affaires stable croissant. Clientèle fidèle du quartier.
Emplacement premium avec parking privé. Stock inclus 35,000 TND.
Bail avantageux 8 ans restants. Système gestion informatisé moderne.''',
        'region': 'tunis',
        'ville': 'Carthage',
        'adresse': 'Rue de Carthage, Quartier Présidence',
        'prix_demande': Decimal('185000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('58000'),
        'nombre_employes': 4,
        'annee_creation': 2016,
        'surface_local': Decimal('150'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Rayonnages, chambres froides, caisses enregistreuses, système sécurité, climatisation',
        'points_forts': 'Quartier haut standing faible concurrence, bail long terme avantageux, clientèle fidèle aisée',
        'opportunites_developpement': 'Service livraison domicile application, produits bio premium, dark kitchen',
        'statut': 'publiee',
        'nombre_vues': 167
    },
    {
        'nom': 'Société Transport Express',
        'secteur': 'transport',
        'description': '''Entreprise transport marchandises avec flotte 8 camions récents (2019-2022).
Contrats long terme avec grandes entreprises industrielles (Nestlé, Délice, etc).
Autorisation transport national complète. Personnel qualifié fidèle.
Garage + entrepôt 400m² inclus. Système GPS tracking temps réel.
Maintenance préventive documentée. Croissance continue 15%/an depuis 5 ans.''',
        'region': 'sousse',
        'ville': 'Sousse Zone Industrielle',
        'adresse': 'Zone Industrielle Sousse Sud',
        'prix_demande': Decimal('650000'),
        'chiffre_affaires': Decimal('580000'),
        'resultat_net': Decimal('98000'),
        'valeur_actifs': Decimal('720000'),
        'endettement': Decimal('180000'),
        'nombre_employes': 12,
        'annee_creation': 2013,
        'surface_local': Decimal('400'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Flotte 8 camions, remorques, équipement garage, système GPS, bureaux équipés',
        'points_forts': 'Flotte récente excellent état, contrats long terme sécurisés, autorisations complètes, réputation solide',
        'opportunites_developpement': 'Transport international Maghreb, logistique e-commerce dernier km, expansion flotte',
        'statut': 'publiee',
        'nombre_vues': 198
    },
    {
        'nom': 'Boulangerie Pâtisserie Dorée',
        'secteur': 'commerce',
        'description': '''Boulangerie-pâtisserie artisanale réputée depuis 20 ans. Production quotidienne pain traditionnel et pâtisseries fines.
Clientèle très fidèle toutes générations. Emplacement central passage important.
Équipement professionnel complet excellent état. Recettes traditionnelles familiales transmises.
Fournisseur aussi de 5 cafés et restaurants de la région.''',
        'region': 'ariana',
        'ville': 'Ariana Centre',
        'adresse': 'Avenue de la République, Ariana',
        'prix_demande': Decimal('195000'),
        'chiffre_affaires': Decimal('285000'),
        'resultat_net': Decimal('62000'),
        'nombre_employes': 6,
        'annee_creation': 2004,
        'surface_local': Decimal('85'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Fours rotatifs professionnels, pétrins, chambres fermentation, frigos, vitrine chauffante',
        'points_forts': 'Réputation établie 20 ans, emplacement premium, clientèle fidèle multi-générationnelle, recettes uniques',
        'opportunites_developpement': 'Livraison entreprises petit-déjeuner, gâteaux personnalisés événements, salon thé annexe',
        'statut': 'publiee',
        'nombre_vues': 142
    },
    {
        'nom': 'Salon Beauté Prestige',
        'secteur': 'services',
        'description': '''Salon de coiffure mixte et institut beauté haut de gamme. Équipement moderne dernière génération.
Clientèle fidèle aisée. Personnel qualifié certifié: 3 coiffeurs, 2 esthéticiennes.
Services: coiffure, coloration, soins cheveux, soins visage, manucure, pédicure, épilation.
Produits professionnels exclusifs (Kérastase, L'Oréal Pro, Dermalogica).''',
        'region': 'ariana',
        'ville': 'Ariana Supérieure',
        'adresse': 'Avenue Habib Bourguiba, Ariana Supérieure',
        'prix_demande': Decimal('175000'),
        'chiffre_affaires': Decimal('145000'),
        'resultat_net': Decimal('38000'),
        'nombre_employes': 5,
        'annee_creation': 2016,
        'surface_local': Decimal('75'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Postes coiffure, bacs lavage, sèche-cheveux pro, fauteuils esthétique, appareils soins',
        'points_forts': 'Clientèle haut standing fidèle, équipe stable qualifiée, produits marques exclusives, parking',
        'opportunites_developpement': 'Services mariages événements, vente produits beauté, extensions cheveux naturels',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 134
    },
    {
        'nom': 'Garage Mécanique Auto Expert',
        'secteur': 'services',
        'description': '''Garage réparation automobile toutes marques. Équipement diagnostic électronique moderne.
Clientèle fidèle particuliers et entreprises (15 flottes). Agrément toutes compagnies assurances.
Services: mécanique générale, carrosserie, peinture, diagnostic électronique.
Mécaniciens expérimentés certifiés. Stock pièces détachées.''',
        'region': 'nabeul',
        'ville': 'Nabeul Centre',
        'adresse': 'Route Nationale, Nabeul',
        'prix_demande': Decimal('390000'),
        'chiffre_affaires': Decimal('325000'),
        'resultat_net': Decimal('78000'),
        'nombre_employes': 8,
        'annee_creation': 2011,
        'surface_local': Decimal('280'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Ponts élévateurs, machine diagnostic, compresseur, cabine peinture, outillage complet',
        'points_forts': 'Agrément assurances, contrats flottes entreprises, mécaniciens expérimentés, emplacement visible',
        'opportunites_developpement': 'Vente pièces détachées, service rapide express, partenariat concessionnaires, lavage auto',
        'statut': 'publiee',
        'nombre_vues': 176
    },
    {
        'nom': 'Pharmacie du Centre',
        'secteur': 'sante',
        'description': '''Pharmacie bien située centre-ville avec clientèle fidèle établie depuis 18 ans.
Chiffre affaires stable et régulier. Emplacement stratégique: proximité cliniques, cabinets médicaux.
Stock valorisé 120,000 TND inclus. Logiciel gestion moderne. Personnel expérimenté.
Parapharmacie et conseil personnalisé. Garde de nuit possible.''',
        'region': 'sfax',
        'ville': 'Sfax Centre',
        'adresse': 'Avenue Habib Bourguiba, Sfax',
        'prix_demande': Decimal('580000'),
        'chiffre_affaires': Decimal('520000'),
        'resultat_net': Decimal('105000'),
        'nombre_employes': 4,
        'annee_creation': 2006,
        'surface_local': Decimal('95'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Rayonnages, réfrigérateurs médicaments, logiciel gestion, caisse, climatisation',
        'points_forts': 'Emplacement premium centre, clientèle fidèle, proximité structures médicales, autorisations complètes',
        'opportunites_developpement': 'Parapharmacie bio, conseil nutrition, livraison domicile personnes âgées',
        'statut': 'publiee',
        'est_mise_en_avant': True,
        'nombre_vues': 298
    },
    {
        'nom': 'École Privée Les Génies',
        'secteur': 'education',
        'description': '''École primaire privée accueillant 180 élèves. Locaux spacieux 450m² avec cour.
Programme tunisien renforcé en langues. Enseignants qualifiés expérimentés.
Transport scolaire 3 bus. Cantine équipée. Salle informatique et bibliothèque.
Taux réussite 100% au concours 6ème. Réputation excellente auprès des parents.''',
        'region': 'tunis',
        'ville': 'Menzah',
        'adresse': 'Rue du Lac Léman, Menzah 6',
        'prix_demande': Decimal('850000'),
        'chiffre_affaires': Decimal('420000'),
        'resultat_net': Decimal('125000'),
        'nombre_employes': 15,
        'annee_creation': 2010,
        'surface_local': Decimal('450'),
        'type_transaction': 'vente_totale',
        'equipements_inclus': 'Mobilier classes, tableaux interactifs, ordinateurs, matériel pédagogique, bus',
        'points_forts': 'Réputation excellente, liste attente élèves, équipe stable, autorisations complètes Ministère',
        'opportunites_developpement': 'Extension collège, activités périscolaires, cours été, enseignement langues',
        'statut': 'publiee',
        'nombre_vues': 267
    }
]

# Créer les entreprises
print("\nCréation des entreprises...\n")
created_count = 0
updated_count = 0

for data in entreprises_data:
    try:
        slug = slugify(data['nom'])
        
        # Vérifier si l'entreprise existe déjà
        if Entreprise.objects.filter(slug=slug).exists():
            print(f"⚠️  Existe déjà: {data['nom']}")
            updated_count += 1
            continue
        
        # Créer l'entreprise
        entreprise = Entreprise.objects.create(
            slug=slug,
            vendeur=vendeur,
            **data
        )
        created_count += 1
        print(f"✅ Créée: {entreprise.nom}")
        print(f"   Secteur: {entreprise.get_secteur_display()}")
        print(f"   Prix: {entreprise.prix_demande:,.0f} TND")
        print(f"   Région: {entreprise.get_region_display()}")
        print()
        
    except Exception as e:
        print(f"❌ Erreur {data['nom']}: {e}\n")

print("=" * 70)
print(f"✨ RÉSUMÉ:")
print(f"   {created_count} entreprises créées")
print(f"   {updated_count} entreprises existaient déjà")
print(f"   Total: {Entreprise.objects.count()} entreprises dans la base")
print("=" * 70)

print(f"\n📱 Accès à la plateforme:")
print(f"   Frontend: http://localhost:3000/")
print(f"   Entreprises: http://localhost:3000/entreprises")
print(f"   Admin: http://localhost:8000/admin/entreprises/entreprise/")
print(f"\n🔐 Connexion:")
print(f"   Admin: admin / admin123")
print(f"   Acheteur: acheteur / test123")
print(f"   Vendeur: vendeur / vendeur123")

print("\n✨ Votre plateforme est maintenant complète avec des données réalistes!\n")
