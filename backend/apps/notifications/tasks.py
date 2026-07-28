"""
Tâches pour les notifications automatiques
"""
from apps.users.models import Alert
from apps.entreprises.models import Entreprise
from .utils import create_notification


def check_alerts_for_entreprise(entreprise):
    """
    Vérifier si une entreprise correspond aux alertes des utilisateurs
    et envoyer des notifications
    """
    if entreprise.statut != 'publiee':
        return
    
    # Récupérer toutes les alertes actives
    alerts = Alert.objects.filter(is_active=True)
    
    for alert in alerts:
        match = True
        
        # Vérifier les critères
        if alert.region and alert.region != entreprise.region:
            match = False
        
        if alert.secteur and alert.secteur != entreprise.secteur:
            match = False
        
        if alert.prix_min and entreprise.prix_demande < alert.prix_min:
            match = False
        
        if alert.prix_max and entreprise.prix_demande > alert.prix_max:
            match = False
        
        if alert.chiffre_affaires_min and entreprise.chiffre_affaires:
            if entreprise.chiffre_affaires < alert.chiffre_affaires_min:
                match = False
        
        # Si tous les critères correspondent, envoyer une notification
        if match:
            create_notification(
                user=alert.user,
                type='alerte_matched',
                titre='🎯 Nouvelle entreprise correspond à vos critères!',
                message=f'L\'entreprise "{entreprise.nom}" dans le secteur {entreprise.get_secteur_display()} correspond à votre alerte "{alert.nom}".',
                lien=f'/entreprises/{entreprise.slug}'
            )
