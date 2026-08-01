from rest_framework import serializers
from .contact_models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """
    Serializer pour les messages de contact
    """
    class Meta:
        model = ContactMessage
        fields = ['id', 'nom', 'email', 'sujet', 'message', 'statut', 'created_at']
        read_only_fields = ['id', 'statut', 'created_at']
    
    def create(self, validated_data):
        # Si l'utilisateur est connecté, l'associer au message
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['utilisateur'] = request.user
        
        return super().create(validated_data)
