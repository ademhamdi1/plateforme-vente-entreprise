from rest_framework import viewsets, permissions, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .actualite_models import Actualite
from .actualite_serializers import ActualiteSerializer


class ActualiteViewSet(viewsets.ModelViewSet):
    """
    API pour les actualités
    - Read: public (published only)
    - Write: admin only
    """
    queryset = Actualite.objects.all()
    serializer_class = ActualiteSerializer
    lookup_field = 'slug'
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'recentes']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        if self.action in ['list', 'retrieve', 'recentes']:
            now = timezone.now()
            return Actualite.objects.filter(
                est_publiee=True,
                date_publication__lte=now
            )
        return Actualite.objects.all()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(auteur=self.request.user)
        else:
            serializer.save()

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        """Retourner les 5 actualités les plus récentes"""
        now = timezone.now()
        actualites = Actualite.objects.filter(
            est_publiee=True,
            date_publication__lte=now
        )[:5]
        serializer = self.get_serializer(actualites, many=True)
        return Response(serializer.data)
