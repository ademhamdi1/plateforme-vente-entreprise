from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .abonnement_models import Abonnement


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_abonnement_gratuit(sender, instance, created, **kwargs):
    """Créer automatiquement un abonnement gratuit pour les nouveaux utilisateurs"""
    if created and instance.user_type == 'vendeur':
        Abonnement.creer_abonnement_gratuit(instance)
