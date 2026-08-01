from rest_framework import serializers
from .temoignage_models import Temoignage


class TemoignageSerializer(serializers.ModelSerializer):
    """Serializer pour témoignages (liste publique)"""
    utilisateur_nom = serializers.CharField(source='utilisateur.username', read_only=True)
    user_type = serializers.CharField(source='utilisateur.user_type', read_only=True)
    etoiles = serializers.CharField(read_only=True)
    
    class Meta:
        model = Temoignage
        fields = [
            'id', 
            'utilisateur_nom', 
            'user_type',
            'contenu', 
            'note', 
            'etoiles',
            'entreprise_concernee', 
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class TemoignageCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un témoignage"""
    
    class Meta:
        model = Temoignage
        fields = ['contenu', 'note', 'entreprise_concernee']
    
    def validate_contenu(self, value):
        if len(value) < 20:
            raise serializers.ValidationError("Le témoignage doit contenir au moins 20 caractères.")
        return value
    
    def validate_note(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value


class TemoignageAdminSerializer(serializers.ModelSerializer):
    """Serializer complet pour admin"""
    utilisateur_nom = serializers.CharField(source='utilisateur.username', read_only=True)
    utilisateur_email = serializers.CharField(source='utilisateur.email', read_only=True)
    user_type = serializers.CharField(source='utilisateur.user_type', read_only=True)
    
    class Meta:
        model = Temoignage
        fields = [
            'id', 
            'utilisateur', 
            'utilisateur_nom', 
            'utilisateur_email',
            'user_type',
            'contenu', 
            'note', 
            'entreprise_concernee', 
            'est_publie',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
