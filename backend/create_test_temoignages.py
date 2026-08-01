"""
Script pour créer des témoignages de test dans PostgreSQL
"""

import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.users.temoignage_models import Temoignage


def create_test_temoignages():
    print("\n" + "="*60)
    print("CRÉATION DE TÉMOIGNAGES DE TEST")
    print("="*60 + "\n")
    
    # Récupérer des utilisateurs
    vendeur = User.objects.filter(user_type='vendeur').first()
    acheteur = User.objects.filter(user_type='acheteur').first()
    
    if not vendeur or not acheteur:
        print("❌ Créez d'abord un vendeur et un acheteur")
        return
    
    print(f"✅ Vendeur: {vendeur.username}")
    print(f"✅ Acheteur: {acheteur.username}\n")
    
    # Témoignages de test
    temoignages_data = [
        {
            'utilisateur': vendeur,
            'contenu': 'Excellente plateforme! J\'ai vendu mon restaurant en moins de 2 mois grâce à la visibilité offerte. Les acheteurs étaient sérieux et qualifiés.',
            'note': 5,
            'entreprise_concernee': 'Restaurant Le Gourmet',
            'est_publie': True,
        },
        {
            'utilisateur': acheteur,
            'contenu': 'Interface intuitive et facile à utiliser. J\'ai trouvé l\'entreprise de mes rêves dans le secteur du tourisme. Le système de messagerie est très pratique.',
            'note': 5,
            'entreprise_concernee': 'Agence de voyage Sahara Tours',
            'est_publie': True,
        },
        {
            'utilisateur': vendeur,
            'contenu': 'Très bon service, l\'équipe est réactive et professionnelle. Les statistiques détaillées m\'ont aidé à comprendre l\'intérêt des acheteurs potentiels.',
            'note': 4,
            'entreprise_concernee': 'Boulangerie Artisanale',
            'est_publie': True,
        },
        {
            'utilisateur': acheteur,
            'contenu': 'Plateforme sécurisée avec de vraies opportunités d\'investissement. J\'apprécie la transparence des informations financières fournies par les vendeurs.',
            'note': 5,
            'entreprise_concernee': '',
            'est_publie': True,
        },
        {
            'utilisateur': vendeur,
            'contenu': 'Bon rapport qualité-prix pour l\'abonnement premium. Les fonctionnalités avancées valent vraiment l\'investissement pour mettre en valeur mon entreprise.',
            'note': 4,
            'entreprise_concernee': 'Café Central',
            'est_publie': False,  # En attente de validation
        },
    ]
    
    # Créer les témoignages
    created_count = 0
    for data in temoignages_data:
        # Vérifier si l'utilisateur a déjà un témoignage similaire
        existe = Temoignage.objects.filter(
            utilisateur=data['utilisateur'],
            contenu=data['contenu']
        ).exists()
        
        if not existe:
            temoignage = Temoignage.objects.create(**data)
            status = "✅ Publié" if temoignage.est_publie else "⏳ En attente"
            print(f"{status} | {temoignage.note}★ | {temoignage.utilisateur.username}")
            print(f"   {temoignage.contenu[:80]}...")
            print("-" * 60)
            created_count += 1
        else:
            print(f"⚠️  Témoignage déjà existant pour {data['utilisateur'].username}")
    
    # Statistiques finales
    print(f"\n✅ {created_count} nouveau(x) témoignage(s) créé(s)")
    print(f"📊 Total témoignages: {Temoignage.objects.count()}")
    print(f"📝 Publiés: {Temoignage.objects.filter(est_publie=True).count()}")
    print(f"⏳ En attente: {Temoignage.objects.filter(est_publie=False).count()}")
    
    print("\n" + "="*60)
    print("✅ TERMINÉ")
    print("="*60 + "\n")


if __name__ == '__main__':
    create_test_temoignages()
