from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Entreprise


@receiver(pre_save, sender=Entreprise)
def check_statut_change(sender, instance, **kwargs):
    """
    Signal pour détecter les changements de statut et envoyer des notifications
    """
    if instance.pk:  # Si l'entreprise existe déjà
        try:
            old_instance = Entreprise.objects.get(pk=instance.pk)
            old_statut = old_instance.statut
            new_statut = instance.statut
            
            # Import ici pour éviter les imports circulaires
            from apps.notifications.utils import notify_annonce_validee, notify_annonce_refusee
            
            # Si le statut passe à "publiee"
            if old_statut != 'publiee' and new_statut == 'publiee':
                instance.published_at = timezone.now()
                # La notification sera envoyée dans post_save
                instance._notify_validation = True
            
            # Si le statut passe à "refusee"
            elif old_statut != 'refusee' and new_statut == 'refusee':
                instance._notify_refus = True
                
        except Entreprise.DoesNotExist:
            pass


@receiver(post_save, sender=Entreprise)
def send_notification_on_statut_change(sender, instance, created, **kwargs):
    """
    Envoyer les notifications après la sauvegarde
    """
    from apps.notifications.utils import notify_annonce_validee, notify_annonce_refusee
    from apps.notifications.tasks import check_alerts_for_entreprise
    
    if not created:
        if hasattr(instance, '_notify_validation'):
            notify_annonce_validee(instance)
            # Vérifier les alertes quand une annonce est validée
            check_alerts_for_entreprise(instance)
            delattr(instance, '_notify_validation')
        
        if hasattr(instance, '_notify_refus'):
            notify_annonce_refusee(instance)
            delattr(instance, '_notify_refus')
