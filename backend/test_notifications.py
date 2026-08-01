"""
Script de test pour le système de notifications
Teste la création et la récupération de notifications depuis PostgreSQL
"""

import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.users.notification_models import Notification


def test_notifications():
    print("\n" + "="*60)
    print("TEST DU SYSTÈME DE NOTIFICATIONS")
    print("="*60 + "\n")
    
    # Récupérer un utilisateur vendeur
    try:
        vendeur = User.objects.filter(user_type='vendeur').first()
        if not vendeur:
            print("❌ Aucun vendeur trouvé. Créez un compte vendeur d'abord.")
            return
        
        print(f"✅ Vendeur trouvé: {vendeur.username} ({vendeur.email})")
        
        # Créer des notifications de test
        print("\n📝 Création de notifications de test...\n")
        
        # Notification 1: Entreprise validée
        notif1 = Notification.creer_notification(
            utilisateur=vendeur,
            type_notif='entreprise_validee',
            titre='✅ Entreprise validée',
            message='Votre entreprise "Test SARL" a été validée et est maintenant publiée.',
            lien='/entreprises/test-sarl'
        )
        print(f"✅ Notification créée: {notif1.titre}")
        
        # Notification 2: Nouveau message
        notif2 = Notification.creer_notification(
            utilisateur=vendeur,
            type_notif='nouveau_message',
            titre='💬 Nouveau message',
            message='Un acheteur vous a envoyé un message concernant votre entreprise.',
            lien='/messages/1'
        )
        print(f"✅ Notification créée: {notif2.titre}")
        
        # Notification 3: Ajouté aux favoris
        notif3 = Notification.creer_notification(
            utilisateur=vendeur,
            type_notif='entreprise_favori',
            titre='⭐ Ajouté aux favoris',
            message='Votre entreprise a été ajoutée aux favoris par un acheteur.',
            lien='/entreprises/test-sarl'
        )
        print(f"✅ Notification créée: {notif3.titre}")
        
        # Récupérer toutes les notifications
        print(f"\n📊 Récupération des notifications depuis PostgreSQL...")
        notifications = Notification.objects.filter(utilisateur=vendeur)
        print(f"✅ {notifications.count()} notification(s) trouvée(s)\n")
        
        # Afficher les détails
        print("-" * 60)
        for notif in notifications[:5]:  # Afficher les 5 dernières
            status = "🔵 Non lue" if not notif.est_lue else "✓ Lue"
            print(f"{status} | {notif.get_type_display()}")
            print(f"   Titre: {notif.titre}")
            print(f"   Message: {notif.message}")
            print(f"   Date: {notif.created_at.strftime('%d/%m/%Y %H:%M')}")
            if notif.lien:
                print(f"   Lien: {notif.lien}")
            print("-" * 60)
        
        # Compter les non lues
        non_lues = Notification.objects.filter(
            utilisateur=vendeur,
            est_lue=False
        ).count()
        print(f"\n📬 Notifications non lues: {non_lues}")
        
        # Marquer une comme lue
        if notif1:
            notif1.est_lue = True
            notif1.save()
            print(f"✅ Notification marquée comme lue: {notif1.titre}")
        
        print("\n" + "="*60)
        print("✅ TEST TERMINÉ AVEC SUCCÈS")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    test_notifications()
