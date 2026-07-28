from .models import Notification


def create_notification(user, type, titre, message, lien=''):
    """
    Fonction utilitaire pour créer une notification
    """
    return Notification.objects.create(
        user=user,
        type=type,
        titre=titre,
        message=message,
        lien=lien
    )


def notify_annonce_validee(entreprise):
    """Notifier le vendeur que son annonce est validée"""
    return create_notification(
        user=entreprise.vendeur,
        type='annonce_validee',
        titre='✅ Votre annonce a été validée',
        message=f'Votre annonce "{entreprise.nom}" a été validée et est maintenant visible par tous les utilisateurs.',
        lien=f'/entreprises/{entreprise.slug}'
    )


def notify_annonce_refusee(entreprise):
    """Notifier le vendeur que son annonce est refusée"""
    raison = entreprise.raison_refus or 'Aucune raison spécifiée'
    return create_notification(
        user=entreprise.vendeur,
        type='annonce_refusee',
        titre='❌ Votre annonce a été refusée',
        message=f'Votre annonce "{entreprise.nom}" a été refusée. Raison: {raison}',
        lien=f'/dashboard'
    )


def notify_nouveau_message(user, conversation):
    """Notifier l'utilisateur d'un nouveau message"""
    return create_notification(
        user=user,
        type='message',
        titre='💬 Nouveau message',
        message=f'Vous avez reçu un nouveau message.',
        lien=f'/messages/{conversation.id}'
    )


def notify_nouvelle_demande(vendeur, entreprise, acheteur):
    """Notifier le vendeur d'une nouvelle demande de contact"""
    return create_notification(
        user=vendeur,
        type='nouvelle_demande',
        titre='📩 Nouvelle demande de contact',
        message=f'{acheteur.get_full_name()} est intéressé par "{entreprise.nom}".',
        lien=f'/messages'
    )
