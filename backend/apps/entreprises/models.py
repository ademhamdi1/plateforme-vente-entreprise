from django.db import models
from django.core.validators import MinValueValidator
from apps.users.models import User
from .validators import validate_image_file, validate_document_file


class Entreprise(models.Model):
    """
    Modèle principal pour les entreprises à vendre
    """
    STATUT_CHOICES = (
        ('brouillon', 'Brouillon'),
        ('en_attente', 'En attente de validation'),
        ('publiee', 'Publiée'),
        ('refusee', 'Refusée'),
        ('vendue', 'Vendue'),
    )
    
    TYPE_TRANSACTION_CHOICES = (
        ('vente_totale', 'Vente totale'),
        ('vente_partielle', 'Vente partielle'),
        ('recherche_associe', 'Recherche d\'associé'),
        ('levee_fonds', 'Levée de fonds'),
    )
    
    SECTEUR_CHOICES = (
        ('industrie', 'Industrie'),
        ('agriculture', 'Agriculture'),
        ('services', 'Services'),
        ('commerce', 'Commerce'),
        ('tourisme', 'Tourisme et hôtellerie'),
        ('transport', 'Transport et logistique'),
        ('sante', 'Santé'),
        ('informatique', 'Informatique et technologie'),
        ('education', 'Éducation et formation'),
        ('btp', 'BTP et construction'),
        ('franchise', 'Franchise'),
        ('startup', 'Startup'),
        ('autre', 'Autre'),
    )
    
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
    
    # Informations générales
    nom = models.CharField(max_length=200, verbose_name='Nom de l\'entreprise')
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField(verbose_name='Description détaillée')
    secteur = models.CharField(
        max_length=50,
        choices=SECTEUR_CHOICES,
        default='autre',
        verbose_name='Secteur d\'activité'
    )
    region = models.CharField(max_length=50, choices=REGION_CHOICES, verbose_name='Région')
    ville = models.CharField(max_length=100, verbose_name='Ville')
    adresse = models.TextField(blank=True, verbose_name='Adresse')
    historique = models.TextField(
        blank=True,
        verbose_name='Historique de l\'entreprise'
    )
    
    # Informations financières
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
    
    # Suite du modèle dans la partie 2...

    # Informations opérationnelles
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
    video_url = models.URLField(
        blank=True,
        max_length=500,
        verbose_name='URL de la vidéo de présentation',
        help_text='Lien YouTube, Vimeo ou autre'
    )
    
    # Type de transaction
    type_transaction = models.CharField(
        max_length=30,
        choices=TYPE_TRANSACTION_CHOICES,
        default='vente_totale',
        verbose_name='Type de transaction'
    )
    
    # Points forts et opportunités
    points_forts = models.TextField(blank=True, verbose_name='Points forts')
    opportunites_developpement = models.TextField(
        blank=True,
        verbose_name='Opportunités de développement'
    )
    
    # Confidentialité
    nom_masque = models.BooleanField(
        default=False,
        verbose_name='Masquer le nom de l\'entreprise'
    )
    adresse_masquee = models.BooleanField(
        default=False,
        verbose_name='Masquer l\'adresse exacte'
    )
    
    # Gestion
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
    raison_refus = models.TextField(
        blank=True,
        verbose_name='Raison du refus'
    )
    est_mise_en_avant = models.BooleanField(
        default=False,
        verbose_name='Mise en avant'
    )
    
    # Statistiques
    nombre_vues = models.PositiveIntegerField(default=0, verbose_name='Nombre de vues')
    
    # Dates
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
        ]
    
    def __str__(self):
        return self.nom
    
    def increment_views(self):
        """Incrémenter le nombre de vues"""
        self.nombre_vues += 1
        self.save(update_fields=['nombre_vues'])


class EntrepriseImage(models.Model):
    """
    Modèle pour les images d'entreprises
    """
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='images',
        verbose_name='Entreprise'
    )
    image = models.ImageField(
        upload_to='entreprises/',
        verbose_name='Image',
        validators=[validate_image_file]
    )
    caption = models.CharField(max_length=200, blank=True, verbose_name='Légende')
    is_logo = models.BooleanField(default=False, verbose_name='Logo')
    order = models.IntegerField(default=0, verbose_name='Ordre')
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'ajout')
    
    class Meta:
        verbose_name = 'Image d\'entreprise'
        verbose_name_plural = 'Images d\'entreprise'
        ordering = ['order', '-uploaded_at']
    
    def __str__(self):
        return f"Image de {self.entreprise.nom}"


class EntrepriseDocument(models.Model):
    """
    Modèle pour les documents PDF des entreprises
    """
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='documents',
        verbose_name='Entreprise'
    )
    document = models.FileField(
        upload_to='documents/',
        verbose_name='Document',
        validators=[validate_document_file]
    )
    titre = models.CharField(max_length=200, verbose_name='Titre')
    description = models.TextField(blank=True, verbose_name='Description')
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'ajout')
    
    class Meta:
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.titre} - {self.entreprise.nom}"
