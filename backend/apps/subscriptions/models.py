from django.db import models
from apps.users.models import User


class Plan(models.Model):
    """
    Modèle pour les plans d'abonnement
    """
    name = models.CharField(max_length=100, verbose_name='Nom')
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField(verbose_name='Description')
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Prix (TND/mois)'
    )
    duration_days = models.IntegerField(
        default=30,
        verbose_name='Durée en jours'
    )
    
    # Fonctionnalités
    max_annonces = models.IntegerField(
        default=1,
        verbose_name='Nombre maximum d\'annonces'
    )
    mise_en_avant = models.BooleanField(
        default=False,
        verbose_name='Mise en avant des annonces'
    )
    statistiques_avancees = models.BooleanField(
        default=False,
        verbose_name='Statistiques avancées'
    )
    support_prioritaire = models.BooleanField(
        default=False,
        verbose_name='Support prioritaire'
    )
    badge_verifie = models.BooleanField(
        default=False,
        verbose_name='Badge vérifié'
    )
    publicite_premium = models.BooleanField(
        default=False,
        verbose_name='Publicité premium'
    )
    accompagnement_personnalise = models.BooleanField(
        default=False,
        verbose_name='Accompagnement personnalisé'
    )
    
    is_active = models.BooleanField(default=True, verbose_name='Actif')
    order = models.IntegerField(default=0, verbose_name='Ordre')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Plan'
        verbose_name_plural = 'Plans'
        ordering = ['order', 'price']
    
    def __str__(self):
        return f"{self.name} - {self.price} TND"


class Subscription(models.Model):
    """
    Modèle pour les abonnements des utilisateurs
    """
    STATUT_CHOICES = (
        ('active', 'Actif'),
        ('expired', 'Expiré'),
        ('cancelled', 'Annulé'),
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscriptions',
        verbose_name='Utilisateur'
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        related_name='subscriptions',
        verbose_name='Plan'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='active',
        verbose_name='Statut'
    )
    start_date = models.DateTimeField(verbose_name='Date de début')
    end_date = models.DateTimeField(verbose_name='Date de fin')
    auto_renew = models.BooleanField(
        default=False,
        verbose_name='Renouvellement automatique'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Abonnement'
        verbose_name_plural = 'Abonnements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.plan.name}"
    
    @property
    def is_active(self):
        from django.utils import timezone
        return self.statut == 'active' and self.end_date > timezone.now()


class Payment(models.Model):
    """
    Modèle pour les paiements
    """
    STATUT_CHOICES = (
        ('pending', 'En attente'),
        ('completed', 'Complété'),
        ('failed', 'Échoué'),
        ('refunded', 'Remboursé'),
    )
    
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name='Abonnement'
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Montant (TND)'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='pending',
        verbose_name='Statut'
    )
    payment_method = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Méthode de paiement'
    )
    transaction_id = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='ID de transaction'
    )
    paid_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date de paiement'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subscription.user.username} - {self.amount} TND"
