import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.categories.models import Category

# Créer les catégories
categories = [
    {'name': 'Industrie', 'slug': 'industrie', 'description': 'Entreprises industrielles', 'icon': '', 'order': 1},
    {'name': 'Services', 'slug': 'services', 'description': 'Entreprises de services', 'icon': '', 'order': 2},
    {'name': 'Commerce', 'slug': 'commerce', 'description': 'Entreprises commerciales', 'icon': '', 'order': 3},
    {'name': 'Tourisme', 'slug': 'tourisme', 'description': 'Hôtels, restaurants, agences', 'icon': '', 'order': 4},
    {'name': 'Transport', 'slug': 'transport', 'description': 'Transport et logistique', 'icon': '', 'order': 5},
    {'name': 'Restauration', 'slug': 'restauration', 'description': 'Restaurants et cafés', 'icon': '', 'order': 6},
    {'name': 'Santé', 'slug': 'sante', 'description': 'Cliniques et centres médicaux', 'icon': '', 'order': 7},
    {'name': 'Informatique', 'slug': 'informatique', 'description': 'Technologies de l\'information', 'icon': '', 'order': 8},
    {'name': 'Agriculture', 'slug': 'agriculture', 'description': 'Agriculture et élevage', 'icon': '', 'order': 9},
    {'name': 'BTP', 'slug': 'btp', 'description': 'Bâtiment et construction', 'icon': '', 'order': 10},
]

for cat_data in categories:
    category, created = Category.objects.get_or_create(
        slug=cat_data['slug'],
        defaults=cat_data
    )
    if created:
        print(f"Catégorie créée : {category.name}")
    else:
        print(f"Catégorie existe déjà : {category.name}")

print("\nDonnées de test créées avec succès !")
print("\nVous pouvez maintenant vous connecter à l'admin :")
print("   URL : http://localhost:8000/admin")
print("   Username : admin")
print("   Password : admin123")
