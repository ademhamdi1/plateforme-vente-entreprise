from django.db import models
from django.conf import settings


class AlerteRecherche(models.Model):
    """Alertes personnalisées pour acheteurs - sauvegardées dans PostgreSQL"""
    
    FREQUENCE_CHOICES = (
        ('immediat', 'Immédiat'),
        ('quotidien', 'Quotidien'),
        ('hebdomadaire', 'Hebdomadaire'),
    )
    
    acheteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='alertes')
    nom_alerte = models.CharField(max_length=200, verbose_name='Nom de l\'alerte')
    
    # Critères de recherche
    secteur = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    prix_min = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    prix_max = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ca_min = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ca_max = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    nombre_employes_min = models.IntegerField(null=True, blank=True)
    nombre_employes_max = models.IntegerField(null=True, blank=True)
    type_transaction = models.CharField(max_length=50, blank=True)
    
    # Configuration de l'alerte
    active = models.BooleanField(default=True)
    frequence = models.CharField(max_length=20, choices=FREQUENCE_CHOICES, default='immediat')
    derniere_notification = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Alerte de recherche'
        verbose_name_plural = 'Alertes de recherche'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nom_alerte} - {self.acheteur.username}"
    
    def match_entreprise(self, entreprise):
        """Vérifie si une entreprise correspond aux critères de l'alerte"""
        if self.secteur and entreprise.secteur != self.secteur:
            return False
        
        if self.region and entreprise.region != self.region:
            return False
        
        if self.prix_min and entreprise.prix_demande < self.prix_min:
            return False
        
        if self.prix_max and entreprise.prix_demande > self.prix_max:
            return False
        
        if self.ca_min and entreprise.chiffre_affaires and entreprise.chiffre_affaires < self.ca_min:
            return False
        
        if self.ca_max and entreprise.chiffre_affaires and entreprise.chiffre_affaires > self.ca_max:
            return False
        
        if self.nombre_employes_min and entreprise.nombre_employes and entreprise.nombre_employes < self.nombre_employes_min:
            return False
        
        if self.nombre_employes_max and entreprise.nombre_employes and entreprise.nombre_employes > self.nombre_employes_max:
            return False
        
        if self.type_transaction and entreprise.type_transaction != self.type_transaction:
            return False
        
        return True
