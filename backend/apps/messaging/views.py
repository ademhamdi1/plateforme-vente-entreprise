from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.db import models
from .models import Conversation, Message, ContactRequest
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    MessageSerializer,
    ContactRequestSerializer
)


class ConversationListView(generics.ListAPIView):
    """
    Liste des conversations de l'utilisateur connecté
    """
    serializer_class = ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            models.Q(acheteur=user) | models.Q(vendeur=user)
        )


class ConversationDetailView(generics.RetrieveAPIView):
    """
    Détails d'une conversation
    """
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(
            models.Q(acheteur=user) | models.Q(vendeur=user)
        )


class MessageCreateView(generics.CreateAPIView):
    """
    Créer un nouveau message dans une conversation
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class ContactRequestCreateView(generics.CreateAPIView):
    """
    Créer une demande de contact
    """
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(acheteur=self.request.user)


class ContactRequestListView(generics.ListAPIView):
    """
    Liste des demandes de contact reçues par le vendeur
    """
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ContactRequest.objects.filter(
            entreprise__vendeur=self.request.user
        )
