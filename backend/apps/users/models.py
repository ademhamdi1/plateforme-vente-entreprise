from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé
    Types: visiteur (par défaut), acheteur, vendeur, admin
    """
    USER_TYPE_CHOICES = (
        ('visiteur', 'Visiteur'),
        ('acheteur', 'Acheteur'),
        ('vendeur', 'Vendeur'),
        ('admin', 'Administrateur'),
    )
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='visiteur',
        verbose_name='Type d\'utilisateur'
    )
    phone = models.CharField(max_length=20, blank=True, verbose_name='Téléphone')
    address = models.TextField(blank=True, verbose_name='Adresse')
    city = models.CharField(max_length=100, blank=True, verbose_name='Ville')
    region = models.CharField(max_length=100, blank=True, verbose_name='Région')
    
    is_verified = models.BooleanField(default=False, verbose_name='Vérifié')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

# Import other models
from .abonnement_models import Abonnement, HistoriquePaiement
from .notification_models import Notification
from .temoignage_models import Temoignage
from .alerte_models import AlerteRecherche
from .contact_models import ContactMessage
