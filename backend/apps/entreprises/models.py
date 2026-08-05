from django.db import models
from django.core.validators import MinValueValidator
from django.utils.text import slugify
from apps.users.models import User


class Entreprise(models.Model):
    """
    Modèle Entreprise selon cahier des charges
    """
    # Secteurs d'activité (du cahier des charges)
    SECTEUR_CHOICES = (
        ('industrie', 'Industrie'),
        ('agriculture', 'Agriculture'),
        ('services', 'Services'),
        ('commerce', 'Commerce'),
        ('tourisme', 'Tourisme et hôtellerie'),
        ('transport', 'Transport et logistique'),
        ('sante', 'Santé'),
        ('informatique', 'Technologies de l\'information'),
        ('education', 'Éducation'),
        ('btp', 'BTP et construction'),
        ('franchise', 'Franchise'),
        ('startup', 'Startups'),
        ('autre', 'Autres activités économiques'),
    )
    
    # Régions de Tunisie (24 gouvernorats)
    REGION_CHOICES = (
        ('tunis', 'Tunis'),
        ('ariana', 'Ariana'),
        ('ben_arous', 'Ben Arous'),
        ('manouba', 'Manouba'),
        ('nabeul', 'Nabeul'),
        ('zaghouan', 'Zaghouan'),
        ('bizerte', 'Bizerte'),
        ('beja', 'Béja'),
        ('jendouba', 'Jendouba'),
        ('le_kef', 'Le Kef'),
        ('siliana', 'Siliana'),
        ('sousse', 'Sousse'),
        ('monastir', 'Monastir'),
        ('mahdia', 'Mahdia'),
        ('sfax', 'Sfax'),
        ('kairouan', 'Kairouan'),
        ('kasserine', 'Kasserine'),
        ('sidi_bouzid', 'Sidi Bouzid'),
        ('gabes', 'Gabès'),
        ('medenine', 'Médenine'),
        ('tataouine', 'Tataouine'),
        ('gafsa', 'Gafsa'),
        ('tozeur', 'Tozeur'),
        ('kebili', 'Kébili'),
    )
    
    # Statuts
    STATUT_CHOICES = (
        ('brouillon', 'Brouillon'),
        ('en_attente', 'En attente de validation'),
        ('publiee', 'Publiée'),
        ('refusee', 'Refusée'),
        ('vendue', 'Vendue'),
    )
    
    # Types de transaction
    TYPE_TRANSACTION_CHOICES = (
        ('vente_totale', 'Vente totale'),
        ('vente_partielle', 'Vente partielle'),
        ('recherche_associe', 'Recherche d\'associé'),
        ('levee_fonds', 'Levée de fonds'),
    )
    
    # === INFORMATIONS GÉNÉRALES ===
    nom = models.CharField(max_length=200, verbose_name='Nom de l\'entreprise')
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField(verbose_name='Description détaillée')
    secteur = models.CharField(
        max_length=50,
        choices=SECTEUR_CHOICES,
        verbose_name='Secteur d\'activité'
    )
    region = models.CharField(
        max_length=50,
        choices=REGION_CHOICES,
        verbose_name='Région'
    )
    ville = models.CharField(max_length=100, verbose_name='Ville')
    adresse = models.CharField(max_length=300, blank=True, null=True, verbose_name='Adresse')
    historique = models.TextField(blank=True, verbose_name='Historique de l\'entreprise')
    
    # === INFORMATIONS FINANCIÈRES ===
    prix_demande = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Prix demandé (TND)'
    )
    chiffre_affaires = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Chiffre d\'affaires (TND)'
    )
    resultat_net = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Résultat net (TND)'
    )
    valeur_actifs = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Valeur des actifs (TND)'
    )
    endettement = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Endettement (TND)'
    )
    
    # === INFORMATIONS OPÉRATIONNELLES ===
    nombre_employes = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Nombre d\'employés'
    )
    annee_creation = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Année de création'
    )
    surface_local = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        verbose_name='Surface du local (m²)'
    )
    equipements_inclus = models.TextField(blank=True, verbose_name='Équipements inclus')
    
    # === MÉDIAS ===
    video_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name='URL vidéo de présentation'
    )
    
    # === TYPE DE TRANSACTION ===
    type_transaction = models.CharField(
        max_length=30,
        choices=TYPE_TRANSACTION_CHOICES,
        default='vente_totale',
        verbose_name='Type de transaction'
    )
    
    # === POINTS FORTS & OPPORTUNITÉS ===
    points_forts = models.TextField(blank=True, verbose_name='Points forts')
    opportunites_developpement = models.TextField(
        blank=True,
        verbose_name='Opportunités de développement'
    )
    
    # === CONFIDENTIALITÉ ===
    nom_masque = models.BooleanField(
        default=False,
        verbose_name='Masquer le nom de l\'entreprise'
    )
    adresse_masquee = models.BooleanField(
        default=False,
        verbose_name='Masquer l\'adresse exacte'
    )
    
    # === GESTION ===
    vendeur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='entreprises',
        verbose_name='Vendeur'
    )
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='brouillon',
        verbose_name='Statut'
    )
    raison_refus = models.TextField(blank=True, verbose_name='Raison du refus')
    
    # === STATISTIQUES ===
    nombre_vues = models.PositiveIntegerField(default=0, verbose_name='Nombre de vues')
    
    # === MISE EN AVANT (FEATURED) ===
    est_mise_en_avant = models.BooleanField(
        default=False,
        verbose_name='Mise en avant'
    )
    date_debut_mise_en_avant = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date début mise en avant'
    )
    date_fin_mise_en_avant = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date fin mise en avant'
    )
    
    # === DATES ===
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')
    published_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date de publication'
    )
    
    class Meta:
        verbose_name = 'Entreprise'
        verbose_name_plural = 'Entreprises'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['statut']),
            models.Index(fields=['secteur']),
            models.Index(fields=['region']),
        ]
    
    def __str__(self):
        return self.nom
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.nom)
            # Ensure unique slug
            counter = 1
            while Entreprise.objects.filter(slug=self.slug).exists():
                self.slug = f"{slugify(self.nom)}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
    
    def increment_views(self):
        """Incrémenter le nombre de vues"""
        self.nombre_vues += 1
        self.save(update_fields=['nombre_vues'])
    
    @property
    def est_active_mise_en_avant(self):
        """Vérifier si la mise en avant est active"""
        from django.utils import timezone
        if not self.est_mise_en_avant:
            return False
        if not self.date_debut_mise_en_avant or not self.date_fin_mise_en_avant:
            return False
        now = timezone.now()
        return self.date_debut_mise_en_avant <= now <= self.date_fin_mise_en_avant
        self.nombre_vues += 1
        self.save(update_fields=['nombre_vues'])


class EntrepriseImage(models.Model):
    """Photos de l'entreprise"""
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Entreprise'
    )
    image = models.ImageField(
        upload_to='entreprises/images/',
        verbose_name='Image'
    )
    caption = models.CharField(max_length=200, blank=True, verbose_name='Légende')
    is_logo = models.BooleanField(default=False, verbose_name='Logo principal')
    order = models.IntegerField(default=0, verbose_name='Ordre')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Image'
        verbose_name_plural = 'Images'
        ordering = ['order', '-uploaded_at']
    
    def __str__(self):
        return f"Image de {self.entreprise.nom}"


class EntrepriseDocument(models.Model):
    """Documents PDF de l'entreprise"""
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Entreprise'
    )
    document = models.FileField(
        upload_to='entreprises/documents/',
        verbose_name='Document PDF'
    )
    titre = models.CharField(max_length=200, verbose_name='Titre du document')
    description = models.TextField(blank=True, verbose_name='Description')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.titre} - {self.entreprise.nom}"


# Import other models
from .favoris_models import Favori
from .messaging_models import Conversation, Message
from .statistiques_models import StatistiqueVue, StatistiqueAction, StatistiqueConversion
from .actualite_models import Actualite
