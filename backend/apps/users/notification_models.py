from django.db import models
from django.conf import settings


class Notification(models.Model):
    """Notification utilisateur - sauvegardée dans PostgreSQL"""
    
    TYPE_CHOICES = [
        ('entreprise_validee', 'Entreprise validée'),
        ('entreprise_refusee', 'Entreprise refusée'),
        ('nouveau_message', 'Nouveau message'),
        ('nouveau_contact', 'Nouveau contact'),
        ('entreprise_favori', 'Ajouté aux favoris'),
        ('abonnement_expire', 'Abonnement expiré'),
        ('system', 'Notification système'),
    ]
    
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    titre = models.CharField(max_length=200)
    message = models.TextField()
    lien = models.CharField(max_length=500, blank=True)  # URL à ouvrir au clic
    est_lue = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
    
    def __str__(self):
        return f"{self.utilisateur.username} - {self.titre}"
    
    @classmethod
    def creer_notification(cls, utilisateur, type_notif, titre, message, lien=''):
        """Créer une notification dans PostgreSQL"""
        return cls.objects.create(
            utilisateur=utilisateur,
            type=type_notif,
            titre=titre,
            message=message,
            lien=lien
        )
