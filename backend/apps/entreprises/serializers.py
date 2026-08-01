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


class EntrepriseSerializer(serializers.ModelSerializer):
    images = EntrepriseImageSerializer(many=True, read_only=True)
    documents = EntrepriseDocumentSerializer(many=True, read_only=True)
    vendeur_nom = serializers.CharField(source='vendeur.get_full_name', read_only=True)
    
    class Meta:
        model = Entreprise
        fields = '__all__'
        read_only_fields = ['vendeur', 'slug', 'nombre_vues', 'created_at', 'updated_at', 'published_at']


class EntrepriseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entreprise
        exclude = ['vendeur', 'slug', 'nombre_vues', 'statut', 'raison_refus', 
                   'est_mise_en_avant', 'created_at', 'updated_at', 'published_at']
    
    def create(self, validated_data):
        validated_data['vendeur'] = self.context['request'].user
        validated_data['statut'] = 'en_attente'  # En attente de validation par admin
        return super().create(validated_data)
