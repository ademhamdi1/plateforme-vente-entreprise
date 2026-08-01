from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .favoris_models import Favori
from .favoris_serializers import FavoriSerializer, FavoriStatusSerializer
from .models import Entreprise
from apps.users.notification_models import Notification


class FavorisListView(generics.ListAPIView):
    """Liste des entreprises favorites de l'acheteur - depuis PostgreSQL"""
    serializer_class = FavoriSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Seuls les acheteurs peuvent avoir des favoris
        return Favori.objects.filter(
            acheteur=self.request.user
        ).select_related('entreprise', 'acheteur')


class FavoriAddView(APIView):
    """Ajouter une entreprise aux favoris - sauvegardé dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        entreprise_slug = request.data.get('entreprise_slug')
        
        if not entreprise_slug:
            return Response(
                {'error': 'Le slug de l\'entreprise est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier que l'utilisateur est acheteur
        if request.user.user_type != 'acheteur':
            return Response(
                {'error': 'Seuls les acheteurs peuvent ajouter des favoris'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Récupérer l'entreprise depuis PostgreSQL
        entreprise = get_object_or_404(Entreprise, slug=entreprise_slug, statut='publiee')
        
        # Vérifier que l'utilisateur n'est pas le vendeur
        if entreprise.vendeur == request.user:
            return Response(
                {'error': 'Vous ne pouvez pas ajouter votre propre entreprise aux favoris'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer ou récupérer le favori dans PostgreSQL
        favori, created = Favori.objects.get_or_create(
            acheteur=request.user,
            entreprise=entreprise
        )
        
        if created:
            # Créer notification pour le vendeur dans PostgreSQL
            Notification.creer_notification(
                utilisateur=entreprise.vendeur,
                type_notif='entreprise_favori',
                titre='⭐ Ajouté aux favoris',
                message=f'{request.user.username} a ajouté votre entreprise "{entreprise.nom}" à ses favoris',
                lien=f'/entreprises/{entreprise.slug}'
            )
            
            serializer = FavoriSerializer(favori)
            return Response(
                {
                    'message': 'Entreprise ajoutée aux favoris',
                    'favori': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'message': 'Entreprise déjà dans les favoris'},
                status=status.HTTP_200_OK
            )


class FavoriRemoveView(APIView):
    """Retirer une entreprise des favoris - supprimé de PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, slug):
        # Vérifier que l'utilisateur est acheteur
        if request.user.user_type != 'acheteur':
            return Response(
                {'error': 'Seuls les acheteurs peuvent gérer leurs favoris'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Récupérer l'entreprise
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        # Supprimer le favori de PostgreSQL
        favori = Favori.objects.filter(
            acheteur=request.user,
            entreprise=entreprise
        ).first()
        
        if favori:
            favori.delete()
            return Response(
                {'message': 'Entreprise retirée des favoris'},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {'error': 'Cette entreprise n\'est pas dans vos favoris'},
                status=status.HTTP_404_NOT_FOUND
            )


class FavoriStatusView(APIView):
    """Vérifier si une entreprise est favorite - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, slug):
        # Si l'utilisateur n'est pas acheteur, retourner false
        if request.user.user_type != 'acheteur':
            return Response({
                'is_favorite': False,
                'favori_id': None
            })
        
        # Récupérer l'entreprise
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        # Vérifier si c'est un favori dans PostgreSQL
        favori = Favori.objects.filter(
            acheteur=request.user,
            entreprise=entreprise
        ).first()
        
        serializer = FavoriStatusSerializer({
            'is_favorite': favori is not None,
            'favori_id': favori.id if favori else None
        })
        
        return Response(serializer.data)


class FavorisCountView(APIView):
    """Nombre total de favoris de l'acheteur - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Favori.objects.filter(acheteur=request.user).count()
        return Response({'count': count})
