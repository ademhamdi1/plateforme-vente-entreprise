from django.db import models
from django.conf import settings


class ContactMessage(models.Model):
    """
    Modèle pour stocker les messages de contact
    """
    SUJET_CHOICES = [
        ('question', 'Question générale'),
        ('support', 'Support technique'),
        ('abonnement', 'Abonnement'),
        ('partenariat', 'Partenariat'),
        ('autre', 'Autre'),
    ]
    
    STATUT_CHOICES = [
        ('nouveau', 'Nouveau'),
        ('en_cours', 'En cours'),
        ('resolu', 'Résolu'),
        ('ferme', 'Fermé'),
    ]
    
    nom = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    sujet = models.CharField(
        max_length=20,
        choices=SUJET_CHOICES,
        blank=True,
        verbose_name="Sujet"
    )
    message = models.TextField(verbose_name="Message")
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='nouveau',
        verbose_name="Statut"
    )
    reponse = models.TextField(blank=True, verbose_name="Réponse")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Date de modification")
    
    # Optionnel: lier à un utilisateur si connecté
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='messages_contact'
    )
    
    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nom} - {self.get_sujet_display() if self.sujet else 'Sans sujet'} - {self.created_at.strftime('%d/%m/%Y')}"
