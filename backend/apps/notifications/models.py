from django.db import models
from apps.users.models import User


class Notification(models.Model):
    """
    Modèle pour les notifications utilisateur
    """
    TYPE_CHOICES = (
        ('message', 'Nouveau message'),
        ('alerte_matched', 'Alerte matchée'),
        ('annonce_validee', 'Annonce validée'),
        ('annonce_refusee', 'Annonce refusée'),
        ('nouvelle_demande', 'Nouvelle demande de contact'),
        ('systeme', 'Notification système'),
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name='Utilisateur'
    )
    type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        verbose_name='Type'
    )
    titre = models.CharField(max_length=200, verbose_name='Titre')
    message = models.TextField(verbose_name='Message')
    lien = models.CharField(
        max_length=500,
        blank=True,
        verbose_name='Lien (URL)'
    )
    est_lu = models.BooleanField(default=False, verbose_name='Lu')
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de création'
    )
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'est_lu']),
        ]
    
    def __str__(self):
        return f"{self.titre} - {self.user.email}"
