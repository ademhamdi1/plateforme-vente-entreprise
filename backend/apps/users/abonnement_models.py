from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Abonnement(models.Model):
    """Abonnement d'un utilisateur - sauvegardé dans PostgreSQL"""
    
    PLAN_CHOICES = [
        ('gratuit', 'Gratuit'),
        ('premium', 'Premium'),
        ('professionnel', 'Professionnel'),
    ]
    
    STATUT_CHOICES = [
        ('actif', 'Actif'),
        ('expire', 'Expiré'),
        ('annule', 'Annulé'),
        ('en_attente', 'En attente de paiement'),
    ]
    
    utilisateur = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='abonnement'
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='gratuit')
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='actif')
    date_debut = models.DateTimeField(default=timezone.now)
    date_fin = models.DateTimeField(null=True, blank=True)
    auto_renouvellement = models.BooleanField(default=False)
    
    # Limites selon le plan
    max_annonces = models.IntegerField(default=2)  # Gratuit: 2, Premium: 10, Pro: illimité (999)
    annonces_mises_en_avant = models.BooleanField(default=False)  # Premium et Pro
    statistiques_avancees = models.BooleanField(default=False)  # Premium et Pro
    badge_verifie = models.BooleanField(default=False)  # Pro uniquement
    support_prioritaire = models.BooleanField(default=False)  # Premium et Pro
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Abonnement'
        verbose_name_plural = 'Abonnements'
    
    def __str__(self):
        return f"{self.utilisateur.username} - {self.get_plan_display()}"
    
    def is_active(self):
        """Vérifie si l'abonnement est actif"""
        if self.statut != 'actif':
            return False
        if self.date_fin and timezone.now() > self.date_fin:
            self.statut = 'expire'
            self.save()
            return False
        return True
    
    def jours_restants(self):
        """Nombre de jours restants"""
        if not self.date_fin:
            return None
        delta = self.date_fin - timezone.now()
        return max(0, delta.days)
    
    @classmethod
    def creer_abonnement_gratuit(cls, utilisateur):
        """Créer un abonnement gratuit par défaut"""
        return cls.objects.create(
            utilisateur=utilisateur,
            plan='gratuit',
            statut='actif',
            max_annonces=2,
            annonces_mises_en_avant=False,
            statistiques_avancees=False,
            badge_verifie=False,
            support_prioritaire=False
        )
    
    @classmethod
    def upgrade_to_premium(cls, utilisateur, duree_mois=1):
        """Passer à Premium"""
        abonnement, created = cls.objects.get_or_create(utilisateur=utilisateur)
        abonnement.plan = 'premium'
        abonnement.statut = 'actif'
        abonnement.date_debut = timezone.now()
        abonnement.date_fin = timezone.now() + timedelta(days=30 * duree_mois)
        abonnement.max_annonces = 10
        abonnement.annonces_mises_en_avant = True
        abonnement.statistiques_avancees = True
        abonnement.badge_verifie = False
        abonnement.support_prioritaire = True
        abonnement.save()
        return abonnement
    
    @classmethod
    def upgrade_to_professionnel(cls, utilisateur, duree_mois=1):
        """Passer à Professionnel"""
        abonnement, created = cls.objects.get_or_create(utilisateur=utilisateur)
        abonnement.plan = 'professionnel'
        abonnement.statut = 'actif'
        abonnement.date_debut = timezone.now()
        abonnement.date_fin = timezone.now() + timedelta(days=30 * duree_mois)
        abonnement.max_annonces = 999  # Illimité
        abonnement.annonces_mises_en_avant = True
        abonnement.statistiques_avancees = True
        abonnement.badge_verifie = True
        abonnement.support_prioritaire = True
        abonnement.save()
        return abonnement


class HistoriquePaiement(models.Model):
    """Historique des paiements - sauvegardé dans PostgreSQL"""
    
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('reussi', 'Réussi'),
        ('echoue', 'Échoué'),
        ('rembourse', 'Remboursé'),
    ]
    
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    abonnement = models.ForeignKey(
        Abonnement,
        on_delete=models.SET_NULL,
        null=True,
        related_name='paiements'
    )
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    devise = models.CharField(max_length=3, default='TND')
    plan = models.CharField(max_length=20)
    duree_mois = models.IntegerField(default=1)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    
    # Informations de paiement (à intégrer avec gateway plus tard)
    transaction_id = models.CharField(max_length=100, blank=True)
    methode_paiement = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
    
    def __str__(self):
        return f"{self.utilisateur.username} - {self.montant} {self.devise} - {self.get_statut_display()}"
