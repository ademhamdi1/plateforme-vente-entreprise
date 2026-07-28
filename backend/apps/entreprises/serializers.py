from rest_framework import serializers
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
    
    def create(self, validated_data):
        validated_data['vendeur'] = self.context['request'].user
        validated_data['statut'] = 'en_attente'
        return super().create(validated_data)
