#!/usr/bin/env python
"""
Script pour créer des notifications de test
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.notifications.models import Notification

def create_test_notifications():
    """Créer des notifications de test pour tous les utilisateurs"""
    
    users = User.objects.all()
    
    if not users.exists():
        print("❌ Aucun utilisateur trouvé. Créez d'abord des utilisateurs.")
        return
    
    print(f"📧 Création de notifications de test pour {users.count()} utilisateur(s)...")
    
    for user in users:
        # Notification 1: Bienvenue
        Notification.objects.create(
            user=user,
            type='systeme',
            titre='🎉 Bienvenue sur BusinessBuy!',
            message='Bienvenue sur la plateforme BusinessBuy! Explorez les entreprises disponibles et trouvez votre opportunité idéale.',
            lien='/entreprises',
            est_lu=False
        )
        
        # Notification 2: Nouvelle fonctionnalité
        Notification.objects.create(
            user=user,
            type='systeme',
            titre='✨ Nouvelles fonctionnalités disponibles',
            message='Découvrez notre nouvelle recherche par secteur d\'activité! Trouvez plus facilement l\'entreprise qui vous correspond.',
            lien='/entreprises',
            est_lu=False
        )
        
        print(f"  ✅ 2 notifications créées pour {user.email}")
    
    # Notifications spécifiques pour les vendeurs
    vendeurs = User.objects.filter(user_type='vendeur')
    for vendeur in vendeurs:
        Notification.objects.create(
            user=vendeur,
            type='systeme',
            titre='📝 Conseil pour vos annonces',
            message='Pensez à remplir le champ "Historique" pour donner plus de contexte à votre entreprise et attirer plus d\'acheteurs!',
            lien='/dashboard',
            est_lu=False
        )
        print(f"  ✅ 1 notification vendeur créée pour {vendeur.email}")
    
    # Notifications spécifiques pour les acheteurs
    acheteurs = User.objects.filter(user_type='acheteur')
    for acheteur in acheteurs:
        Notification.objects.create(
            user=acheteur,
            type='alerte_matched',
            titre='🎯 Nouvelle entreprise correspond à vos critères',
            message='Une nouvelle entreprise dans le secteur "Informatique" vient d\'être publiée. Consultez-la maintenant!',
            lien='/entreprises',
            est_lu=False
        )
        print(f"  ✅ 1 notification acheteur créée pour {acheteur.email}")
    
    total = Notification.objects.count()
    print(f"\n✅ Terminé! {total} notification(s) créée(s) au total.")
    print(f"🔔 Connectez-vous sur le frontend pour les voir!")

if __name__ == '__main__':
    create_test_notifications()
