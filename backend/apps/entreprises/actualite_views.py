from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .actualite_models import Actualite
from .actualite_serializers import ActualiteSerializer


class ActualiteViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API pour les actualités
    - Liste des actualités publiées
    - Détail d'une actualité
    """
    queryset = Actualite.objects.filter(est_publiee=True)
    serializer_class = ActualiteSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        """Retourner seulement les actualités publiées et dont la date est passée"""
        now = timezone.now()
        return Actualite.objects.filter(
            est_publiee=True,
            date_publication__lte=now
        )
    
    @action(detail=False, methods=['get'])
    def recentes(self, request):
        """Retourner les 5 actualités les plus récentes"""
        actualites = self.get_queryset()[:5]
        serializer = self.get_serializer(actualites, many=True)
        return Response(serializer.data)
