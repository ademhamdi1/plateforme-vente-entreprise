from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé
    """
    USER_TYPE_CHOICES = (
        ('acheteur', 'Acheteur'),
        ('vendeur', 'Vendeur'),
        ('admin', 'Administrateur'),
    )
    
    user_type = models.CharField(
        max_length=20,
        choices=USER_TYPE_CHOICES,
        default='acheteur',
        verbose_name='Type d\'utilisateur'
    )
    phone = models.CharField(max_length=20, blank=True, verbose_name='Téléphone')
    address = models.TextField(blank=True, verbose_name='Adresse')
    city = models.CharField(max_length=100, blank=True, verbose_name='Ville')
    region = models.CharField(max_length=100, blank=True, verbose_name='Région')
    profile_picture = models.ImageField(
        upload_to='profiles/',
        blank=True,
        null=True,
        verbose_name='Photo de profil'
    )
    is_verified = models.BooleanField(default=False, verbose_name='Vérifié')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"


class SavedEntreprise(models.Model):
    """
    Modèle pour sauvegarder les entreprises favorites
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='saved_entreprises',
        verbose_name='Utilisateur'
    )
    entreprise = models.ForeignKey(
        'entreprises.Entreprise',
        on_delete=models.CASCADE,
        related_name='saved_by',
        verbose_name='Entreprise'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de sauvegarde')
    
    class Meta:
        verbose_name = 'Entreprise sauvegardée'
        verbose_name_plural = 'Entreprises sauvegardées'
        unique_together = ['user', 'entreprise']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.entreprise.nom}"


class Alert(models.Model):
    """
    Modèle pour les alertes de recherche
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='alerts',
        verbose_name='Utilisateur'
    )
    name = models.CharField(max_length=200, verbose_name='Nom de l\'alerte')
    secteur = models.CharField(max_length=50, blank=True, verbose_name='Secteur d\'activité')
    region = models.CharField(max_length=100, blank=True, verbose_name='Région')
    min_price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Prix minimum'
    )
    max_price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Prix maximum'
    )
    min_ca = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='CA minimum'
    )
    is_active = models.BooleanField(default=True, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    
    class Meta:
        verbose_name = 'Alerte'
        verbose_name_plural = 'Alertes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"
