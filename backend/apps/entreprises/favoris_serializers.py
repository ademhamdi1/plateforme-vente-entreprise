from rest_framework import serializers
from .favoris_models import Favori
from .serializers import EntrepriseSerializer


class FavoriSerializer(serializers.ModelSerializer):
    entreprise = EntrepriseSerializer(read_only=True)
    entreprise_slug = serializers.SlugField(write_only=True, required=True)
    
    class Meta:
        model = Favori
        fields = ['id', 'acheteur', 'entreprise', 'entreprise_slug', 'created_at']
        read_only_fields = ['id', 'acheteur', 'created_at']


class FavoriStatusSerializer(serializers.Serializer):
    """Serializer pour vérifier si une entreprise est favorite"""
    is_favorite = serializers.BooleanField()
    favori_id = serializers.IntegerField(allow_null=True)
