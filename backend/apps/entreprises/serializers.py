from rest_framework import serializers
from django.utils import timezone
from django.utils.text import slugify
from .models import Entreprise, EntrepriseImage, EntrepriseDocument


class EntrepriseImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrepriseImage
        fields = ['id', 'image', 'caption', 'is_logo', 'order', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class EntrepriseDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntrepriseDocument
        fields = ['id', 'document', 'titre', 'description', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class EntrepriseListSerializer(serializers.ModelSerializer):
    """
    Serializer pour la liste des entreprises (vue simplifiée)
    """
    logo = serializers.SerializerMethodField()
    
    class Meta:
        model = Entreprise
        fields = [
            'id', 'nom', 'slug', 'description', 'secteur',
            'region', 'ville', 'prix_demande', 'chiffre_affaires',
            'nombre_employes', 'annee_creation', 'type_transaction',
            'logo', 'nombre_vues', 'est_mise_en_avant', 'created_at'
        ]
    
    def get_logo(self, obj):
        logo = obj.images.filter(is_logo=True).first()
        if logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(logo.image.url)
        return None


class EntrepriseDetailSerializer(serializers.ModelSerializer):
    """
    Serializer détaillé pour une entreprise
    """
    images = EntrepriseImageSerializer(many=True, read_only=True)
    documents = EntrepriseDocumentSerializer(many=True, read_only=True)
    vendeur_nom = serializers.CharField(source='vendeur.get_full_name', read_only=True)
    
    class Meta:
        model = Entreprise
        fields = [
            'id', 'nom', 'slug', 'description', 'secteur', 'historique',
            'region', 'ville', 'adresse', 'prix_demande',
            'chiffre_affaires', 'resultat_net', 'valeur_actifs',
            'endettement', 'nombre_employes', 'annee_creation',
            'surface_local', 'equipements_inclus', 'video_url', 'type_transaction',
            'points_forts', 'opportunites_developpement',
            'nom_masque', 'adresse_masquee', 'images', 'documents',
            'vendeur_nom', 'nombre_vues', 'est_mise_en_avant',
            'statut', 'raison_refus',
            'created_at', 'published_at'
        ]


class EntrepriseCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer pour créer/modifier une entreprise
    """
    class Meta:
        model = Entreprise
        fields = [
            'nom', 'description', 'secteur', 'historique', 'region', 'ville',
            'adresse', 'prix_demande', 'chiffre_affaires',
            'resultat_net', 'valeur_actifs', 'endettement',
            'nombre_employes', 'annee_creation', 'surface_local',
            'equipements_inclus', 'video_url', 'type_transaction', 'points_forts',
            'opportunites_developpement', 'nom_masque', 'adresse_masquee'
        ]

    def get_unique_slug(self, nom, instance=None):
        base_slug = slugify(nom) or 'entreprise'
        slug = base_slug
        suffix = 2
        queryset = Entreprise.objects.all()

        if instance:
            queryset = queryset.exclude(pk=instance.pk)

        while queryset.filter(slug=slug).exists():
            slug = f'{base_slug}-{suffix}'
            suffix += 1

        return slug
    
    def create(self, validated_data):
        validated_data['vendeur'] = self.context['request'].user
        validated_data['slug'] = self.get_unique_slug(validated_data['nom'])
        validated_data['statut'] = 'publiee'
        validated_data['published_at'] = timezone.now()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'nom' in validated_data and validated_data['nom'] != instance.nom:
            validated_data['slug'] = self.get_unique_slug(validated_data['nom'], instance)

        return super().update(instance, validated_data)
