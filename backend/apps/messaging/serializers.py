from rest_framework import serializers
from .models import Conversation, Message, ContactRequest


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_name',
            'content', 'attachment', 'is_read', 'created_at'
        ]
        read_only_fields = ['id', 'sender', 'created_at']


class ConversationListSerializer(serializers.ModelSerializer):
    acheteur_name = serializers.CharField(source='acheteur.get_full_name', read_only=True)
    vendeur_name = serializers.CharField(source='vendeur.get_full_name', read_only=True)
    entreprise_nom = serializers.CharField(source='entreprise.nom', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'entreprise', 'entreprise_nom', 'acheteur',
            'acheteur_name', 'vendeur', 'vendeur_name', 'sujet',
            'is_active', 'last_message', 'unread_count',
            'created_at', 'updated_at'
        ]
    
    def get_last_message(self, obj):
        last_msg = obj.get_last_message()
        if last_msg:
            return {
                'content': last_msg.content[:50],
                'created_at': last_msg.created_at,
                'sender': last_msg.sender.username
            }
        return None
    
    def get_unread_count(self, obj):
        user = self.context['request'].user
        return obj.messages.filter(is_read=False).exclude(sender=user).count()


class ConversationDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = [
            'id', 'entreprise', 'acheteur', 'vendeur',
            'sujet', 'is_active', 'messages', 'created_at', 'updated_at'
        ]


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = [
            'id', 'entreprise', 'acheteur', 'nom', 'email',
            'telephone', 'message', 'statut', 'created_at'
        ]
        read_only_fields = ['id', 'acheteur', 'statut', 'created_at']
