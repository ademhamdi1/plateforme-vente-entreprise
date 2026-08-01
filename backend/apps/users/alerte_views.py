from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .alerte_models import AlerteRecherche
from .alerte_serializers import AlerteRechercheSerializer, AlerteRechercheCreateSerializer


class IsAcheteur(permissions.BasePermission):
    """Permission pour acheteurs uniquement"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'acheteur'


class MesAlertesView(generics.ListAPIView):
    """Liste de mes alertes - depuis PostgreSQL"""
    serializer_class = AlerteRechercheSerializer
    permission_classes = [IsAcheteur]
    
    def get_queryset(self):
        return AlerteRecherche.objects.filter(acheteur=self.request.user)


class AlerteCreateView(generics.CreateAPIView):
    """Créer une alerte - sauvegardée dans PostgreSQL"""
    serializer_class = AlerteRechercheCreateSerializer
    permission_classes = [IsAcheteur]
    
    def perform_create(self, serializer):
        serializer.save(acheteur=self.request.user)


class AlerteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Voir/Modifier/Supprimer une alerte - depuis/vers PostgreSQL"""
    serializer_class = AlerteRechercheSerializer
    permission_classes = [IsAcheteur]
    
    def get_queryset(self):
        return AlerteRecherche.objects.filter(acheteur=self.request.user)


class AlerteToggleView(APIView):
    """Activer/Désactiver une alerte"""
    permission_classes = [IsAcheteur]
    
    def post(self, request, pk):
        try:
            alerte = AlerteRecherche.objects.get(pk=pk, acheteur=request.user)
            alerte.active = not alerte.active
            alerte.save()
            
            return Response({
                'message': f'Alerte {"activée" if alerte.active else "désactivée"}',
                'alerte': AlerteRechercheSerializer(alerte).data
            })
        except AlerteRecherche.DoesNotExist:
            return Response(
                {'error': 'Alerte non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
