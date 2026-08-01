from rest_framework import generics, permissions, status, parsers
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from .messaging_models import Conversation, Message
from .messaging_serializers import (
    ConversationSerializer, 
    ConversationDetailSerializer, 
    MessageSerializer
)
from .models import Entreprise
from apps.users.notification_models import Notification


class ConversationListView(generics.ListAPIView):
    """Liste des conversations de l'utilisateur connecté - depuis PostgreSQL"""
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Récupérer toutes les conversations où l'utilisateur est acheteur ou vendeur
        return Conversation.objects.filter(
            Q(acheteur=user) | Q(vendeur=user)
        ).select_related('entreprise', 'acheteur', 'vendeur')


class ConversationDetailView(generics.RetrieveAPIView):
    """Détail d'une conversation avec tous les messages - depuis PostgreSQL"""
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            Q(acheteur=user) | Q(vendeur=user)
        ).select_related('entreprise', 'acheteur', 'vendeur').prefetch_related('messages')
    
    def retrieve(self, request, *args, **kwargs):
        conversation = self.get_object()
        
        # Marquer les messages reçus comme lus dans PostgreSQL
        Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(sender=request.user).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        serializer = self.get_serializer(conversation)
        return Response(serializer.data)


class ConversationCreateView(APIView):
    """Créer une nouvelle conversation - sauvegardée dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        entreprise_slug = request.data.get('entreprise_slug')
        
        if not entreprise_slug:
            return Response(
                {'error': 'Le slug de l\'entreprise est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Récupérer l'entreprise depuis PostgreSQL
        entreprise = get_object_or_404(Entreprise, slug=entreprise_slug, statut='publiee')
        
        # Vérifier que l'utilisateur est acheteur
        if request.user.user_type != 'acheteur':
            return Response(
                {'error': 'Seuls les acheteurs peuvent démarrer une conversation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier que l'utilisateur n'est pas le vendeur
        if entreprise.vendeur == request.user:
            return Response(
                {'error': 'Vous ne pouvez pas contacter votre propre entreprise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer ou récupérer la conversation dans PostgreSQL
        conversation, created = Conversation.objects.get_or_create(
            entreprise=entreprise,
            acheteur=request.user,
            vendeur=entreprise.vendeur
        )
        
        # Créer notification pour le vendeur si nouvelle conversation dans PostgreSQL
        if created:
            Notification.creer_notification(
                utilisateur=entreprise.vendeur,
                type_notif='nouveau_contact',
                titre='📧 Nouveau contact',
                message=f'{request.user.username} souhaite vous contacter concernant "{entreprise.nom}"',
                lien=f'/messages/{conversation.id}'
            )
        
        serializer = ConversationSerializer(conversation, context={'request': request})
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class MessageCreateView(generics.CreateAPIView):
    """Envoyer un message dans une conversation - sauvegardé dans PostgreSQL"""
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('conversation_id')
        conversation = get_object_or_404(
            Conversation,
            id=conversation_id
        )
        
        # Vérifier que l'utilisateur fait partie de la conversation
        if self.request.user not in [conversation.acheteur, conversation.vendeur]:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Vous n\'êtes pas autorisé à participer à cette conversation')
        
        # Sauvegarder le message avec pièce jointe dans PostgreSQL + /media/
        message = serializer.save(
            conversation=conversation,
            sender=self.request.user
        )
        
        # Mettre à jour la date de la conversation
        conversation.updated_at = timezone.now()
        conversation.save()
        
        # Créer notification pour le destinataire dans PostgreSQL
        destinataire = conversation.vendeur if self.request.user == conversation.acheteur else conversation.acheteur
        Notification.creer_notification(
            utilisateur=destinataire,
            type_notif='nouveau_message',
            titre='💬 Nouveau message',
            message=f'{self.request.user.username} vous a envoyé un message concernant "{conversation.entreprise.nom}"',
            lien=f'/messages/{conversation.id}'
        )


class ConversationArchiveView(APIView):
    """Archiver une conversation - mis à jour dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        conversation = get_object_or_404(
            Conversation,
            id=pk
        )
        
        # Vérifier que l'utilisateur fait partie de la conversation
        if request.user not in [conversation.acheteur, conversation.vendeur]:
            return Response(
                {'error': 'Vous n\'êtes pas autorisé à archiver cette conversation'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Archiver selon le type d'utilisateur - sauvegardé dans PostgreSQL
        if request.user == conversation.acheteur:
            conversation.is_archived_by_acheteur = True
        else:
            conversation.is_archived_by_vendeur = True
        
        conversation.save()
        
        return Response({'message': 'Conversation archivée'})


class UnreadMessagesCountView(APIView):
    """Nombre total de messages non lus - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Compter tous les messages non lus reçus par l'utilisateur depuis PostgreSQL
        unread_count = Message.objects.filter(
            conversation__in=Conversation.objects.filter(
                Q(acheteur=request.user) | Q(vendeur=request.user)
            ),
            is_read=False
        ).exclude(sender=request.user).count()
        
        return Response({'unread_count': unread_count})
