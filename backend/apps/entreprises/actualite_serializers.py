from rest_framework import serializers
from .actualite_models import Actualite


class ActualiteSerializer(serializers.ModelSerializer):
    auteur_nom = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Actualite
        fields = [
            'id', 'titre', 'slug', 'contenu', 'image', 'image_url',
            'auteur', 'auteur_nom', 'est_publiee', 'date_publication',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_auteur_nom(self, obj):
        if obj.auteur:
            return f"{obj.auteur.first_name} {obj.auteur.last_name}"
        return "Administrateur"
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
