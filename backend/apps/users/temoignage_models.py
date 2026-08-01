from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Temoignage(models.Model):
    """Témoignage client - sauvegardé dans PostgreSQL"""
    
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='temoignages'
    )
    contenu = models.TextField(
        max_length=500,
        help_text="Texte du témoignage (500 caractères max)"
    )
    note = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Note de 1 à 5 étoiles"
    )
    entreprise_concernee = models.CharField(
        max_length=200,
        blank=True,
        help_text="Nom de l'entreprise achetée/vendue (optionnel)"
    )
    est_publie = models.BooleanField(
        default=False,
        help_text="Publié après validation admin"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Témoignage'
        verbose_name_plural = 'Témoignages'
    
    def __str__(self):
        return f"{self.utilisateur.username} - {self.note}★ - {'✓ Publié' if self.est_publie else '⏳ En attente'}"
    
    @property
    def etoiles(self):
        """Retourne les étoiles sous forme de string"""
        return '★' * self.note + '☆' * (5 - self.note)
