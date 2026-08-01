from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import models
from .temoignage_models import Temoignage
from .temoignage_serializers import (
    TemoignageSerializer, 
    TemoignageCreateSerializer,
    TemoignageAdminSerializer
)


class TemoignagesPublicsListView(generics.ListAPIView):
    """Liste des témoignages publiés (public) - depuis PostgreSQL"""
    serializer_class = TemoignageSerializer
    permission_classes = []  # Accessible à tous
    
    def get_queryset(self):
        # Seulement les témoignages publiés
        return Temoignage.objects.filter(est_publie=True).select_related('utilisateur')[:12]


class TemoignageCreateView(generics.CreateAPIView):
    """Créer un témoignage (authentifié) - sauvegardé dans PostgreSQL"""
    serializer_class = TemoignageCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Vérifier si l'utilisateur a déjà un témoignage en attente
        temoignage_existant = Temoignage.objects.filter(
            utilisateur=self.request.user,
            est_publie=False
        ).exists()
        
        if temoignage_existant:
            return Response(
                {'error': 'Vous avez déjà un témoignage en attente de validation.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save(utilisateur=self.request.user)


class MesTemoignagesView(generics.ListAPIView):
    """Mes témoignages (authentifié) - depuis PostgreSQL"""
    serializer_class = TemoignageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Temoignage.objects.filter(utilisateur=self.request.user)


# === VUES ADMIN ===

class IsAdmin(permissions.BasePermission):
    """Permission pour les administrateurs uniquement"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'admin'


class AdminTemoignagesListView(generics.ListAPIView):
    """Liste tous les témoignages (admin only) - depuis PostgreSQL"""
    serializer_class = TemoignageAdminSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        # Filtrer par statut si paramètre fourni
        statut = self.request.query_params.get('statut', None)
        queryset = Temoignage.objects.select_related('utilisateur')
        
        if statut == 'en_attente':
            return queryset.filter(est_publie=False)
        elif statut == 'publies':
            return queryset.filter(est_publie=True)
        
        return queryset


class AdminPublierTemoignageView(APIView):
    """Publier un témoignage (admin only) - mis à jour dans PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def post(self, request, pk):
        try:
            temoignage = Temoignage.objects.get(id=pk)
            temoignage.est_publie = True
            temoignage.save()
            
            # Créer notification pour l'utilisateur
            from .notification_models import Notification
            Notification.creer_notification(
                utilisateur=temoignage.utilisateur,
                type_notif='system',
                titre='✅ Témoignage publié',
                message='Votre témoignage a été validé et publié sur la plateforme.',
                lien='/'
            )
            
            serializer = TemoignageAdminSerializer(temoignage)
            return Response({
                'message': 'Témoignage publié avec succès',
                'temoignage': serializer.data
            })
        except Temoignage.DoesNotExist:
            return Response(
                {'error': 'Témoignage non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminSupprimerTemoignageView(APIView):
    """Supprimer un témoignage (admin only) - supprimé de PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def delete(self, request, pk):
        try:
            temoignage = Temoignage.objects.get(id=pk)
            utilisateur = temoignage.utilisateur
            temoignage.delete()
            
            # Créer notification pour l'utilisateur
            from .notification_models import Notification
            Notification.creer_notification(
                utilisateur=utilisateur,
                type_notif='system',
                titre='❌ Témoignage refusé',
                message='Votre témoignage n\'a pas été accepté. Veuillez le modifier et le soumettre à nouveau.',
                lien='/'
            )
            
            return Response({
                'message': 'Témoignage supprimé'
            })
        except Temoignage.DoesNotExist:
            return Response(
                {'error': 'Témoignage non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminStatistiquesTemoignagesView(APIView):
    """Statistiques témoignages (admin only) - depuis PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        stats = {
            'total': Temoignage.objects.count(),
            'publies': Temoignage.objects.filter(est_publie=True).count(),
            'en_attente': Temoignage.objects.filter(est_publie=False).count(),
            'note_moyenne': Temoignage.objects.filter(est_publie=True).aggregate(
                models.Avg('note')
            )['note__avg'] or 0
        }
        return Response(stats)
