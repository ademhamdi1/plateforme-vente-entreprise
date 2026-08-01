from rest_framework import serializers
from .models import EntrepriseImage, EntrepriseDocument


class EntrepriseImageSerializer(serializers.ModelSerializer):
    """Serializer pour les images d'entreprise"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = EntrepriseImage
        fields = ['id', 'image', 'image_url', 'legende', 'ordre', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class EntrepriseDocumentSerializer(serializers.ModelSerializer):
    """Serializer pour les documents d'entreprise"""
    document_url = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = EntrepriseDocument
        fields = ['id', 'document', 'document_url', 'nom', 'description', 'file_size', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_document_url(self, obj):
        request = self.context.get('request')
        if obj.document and hasattr(obj.document, 'url'):
            if request:
                return request.build_absolute_uri(obj.document.url)
            return obj.document.url
        return None
    
    def get_file_size(self, obj):
        """Retourne la taille du fichier en KB"""
        if obj.document and hasattr(obj.document, 'size'):
            return round(obj.document.size / 1024, 2)  # Convertir en KB
        return None
