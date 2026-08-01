from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .notification_models import Notification
from rest_framework import serializers


class NotificationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'type_display', 'titre', 'message', 'lien', 'est_lue', 'created_at']
        read_only_fields = ['id', 'created_at']


class NotificationsListView(generics.ListAPIView):
    """Liste des notifications de l'utilisateur - depuis PostgreSQL"""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(utilisateur=self.request.user)[:50]


class NotificationsNonLuesCountView(APIView):
    """Nombre de notifications non lues - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        count = Notification.objects.filter(
            utilisateur=request.user,
            est_lue=False
        ).count()
        return Response({'count': count})


class MarquerCommeLueView(APIView):
    """Marquer une notification comme lue - mis à jour dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            notification = Notification.objects.get(
                id=pk,
                utilisateur=request.user
            )
            notification.est_lue = True
            notification.save()
            return Response({'message': 'Notification marquée comme lue'})
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )


class MarquerToutCommeLuView(APIView):
    """Marquer toutes les notifications comme lues - mis à jour dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        Notification.objects.filter(
            utilisateur=request.user,
            est_lue=False
        ).update(est_lue=True)
        return Response({'message': 'Toutes les notifications sont marquées comme lues'})
