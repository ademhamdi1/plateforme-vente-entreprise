from rest_framework import serializers
from .messaging_models import Conversation, Message
from apps.users.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    sender_user_type = serializers.CharField(source='sender.user_type', read_only=True)
    attachment_url = serializers.SerializerMethodField()
    attachment_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'sender_username', 'sender_user_type', 
                  'content', 'attachment', 'attachment_url', 'attachment_name',
                  'created_at', 'is_read', 'read_at']
        read_only_fields = ['id', 'conversation', 'sender', 'created_at', 'read_at']
    
    def get_attachment_url(self, obj):
        if obj.attachment:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.attachment.url)
            return obj.attachment.url
        return None
    
    def get_attachment_name(self, obj):
        if obj.attachment:
            return obj.attachment.name.split('/')[-1]
        return None


class ConversationSerializer(serializers.ModelSerializer):
    acheteur_username = serializers.CharField(source='acheteur.username', read_only=True)
    vendeur_username = serializers.CharField(source='vendeur.username', read_only=True)
    entreprise_nom = serializers.CharField(source='entreprise.nom', read_only=True)
    entreprise_slug = serializers.CharField(source='entreprise.slug', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = ['id', 'entreprise', 'entreprise_nom', 'entreprise_slug',
                  'acheteur', 'acheteur_username', 'vendeur', 'vendeur_username',
                  'created_at', 'updated_at', 'is_archived_by_acheteur', 
                  'is_archived_by_vendeur', 'last_message', 'unread_count']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return {
                'content': last_msg.content,
                'sender_username': last_msg.sender.username,
                'created_at': last_msg.created_at,
                'is_read': last_msg.is_read
            }
        return None
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user:
            # Compter les messages non lus reçus par l'utilisateur courant
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0


class ConversationDetailSerializer(ConversationSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    acheteur = UserSerializer(read_only=True)
    vendeur = UserSerializer(read_only=True)
    
    class Meta(ConversationSerializer.Meta):
        fields = ConversationSerializer.Meta.fields + ['messages']
