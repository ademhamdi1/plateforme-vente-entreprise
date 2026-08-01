from django.db import models
from django.conf import settings
from .models import Entreprise


class Favori(models.Model):
    """Entreprise favorite d'un acheteur - sauvegardée dans PostgreSQL"""
    acheteur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='favoris'
    )
    entreprise = models.ForeignKey(
        Entreprise, 
        on_delete=models.CASCADE, 
        related_name='favoris'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['acheteur', 'entreprise']
        verbose_name = 'Favori'
        verbose_name_plural = 'Favoris'
    
    def __str__(self):
        return f"{self.acheteur.username} - {self.entreprise.nom}"
