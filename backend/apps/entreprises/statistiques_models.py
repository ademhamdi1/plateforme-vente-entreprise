from django.db import models
from django.conf import settings
from .models import Entreprise


class StatistiqueVue(models.Model):
    """Statistique de vue d'une entreprise - sauvegardée dans PostgreSQL"""
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE, related_name='statistiques_vues')
    date = models.DateField()
    nombre_vues = models.IntegerField(default=0)
    nombre_vues_uniques = models.IntegerField(default=0)  # IP uniques
    temps_moyen_secondes = models.IntegerField(default=0)  # Temps moyen sur la page
    
    class Meta:
        ordering = ['-date']
        unique_together = ['entreprise', 'date']
        verbose_name = 'Statistique Vue'
        verbose_name_plural = 'Statistiques Vues'
    
    def __str__(self):
        return f"{self.entreprise.nom} - {self.date} - {self.nombre_vues} vues"


class StatistiqueAction(models.Model):
    """Actions des visiteurs sur une entreprise - sauvegardées dans PostgreSQL"""
    
    ACTION_CHOICES = [
        ('vue', 'Vue de la page'),
        ('contact', 'Clic sur contact'),
        ('favori', 'Ajout aux favoris'),
        ('partage', 'Partage'),
        ('document', 'Téléchargement document'),
        ('image', 'Vue image'),
    ]
    
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE, related_name='actions')
    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='actions_entreprises'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Statistique Action'
        verbose_name_plural = 'Statistiques Actions'
    
    def __str__(self):
        return f"{self.entreprise.nom} - {self.get_action_display()} - {self.created_at}"


class StatistiqueConversion(models.Model):
    """Taux de conversion (vue -> contact) - sauvegardé dans PostgreSQL"""
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE, related_name='conversions')
    date = models.DateField()
    nombre_vues = models.IntegerField(default=0)
    nombre_contacts = models.IntegerField(default=0)
    taux_conversion = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Pourcentage
    
    class Meta:
        ordering = ['-date']
        unique_together = ['entreprise', 'date']
        verbose_name = 'Statistique Conversion'
        verbose_name_plural = 'Statistiques Conversions'
    
    def __str__(self):
        return f"{self.entreprise.nom} - {self.date} - {self.taux_conversion}%"
    
    def calculer_taux(self):
        """Calculer le taux de conversion"""
        if self.nombre_vues > 0:
            self.taux_conversion = (self.nombre_contacts / self.nombre_vues) * 100
        else:
            self.taux_conversion = 0
        self.save()
