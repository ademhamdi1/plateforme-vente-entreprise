from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from .models import User
from .serializers import UserSerializer


class AdminUserListView(generics.ListAPIView):
    """Liste de tous les utilisateurs - admin uniquement"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get('user_type')
        is_active = self.request.query_params.get('is_active')
        is_verified = self.request.query_params.get('is_verified')
        search = self.request.query_params.get('search')

        if user_type:
            queryset = queryset.filter(user_type=user_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active == 'true')
        if is_verified is not None:
            queryset = queryset.filter(is_verified=is_verified == 'true')
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        return queryset


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail + Modification d'un utilisateur - admin uniquement"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()


class AdminUserToggleActiveView(APIView):
    """Suspendre/Réactiver un utilisateur - admin uniquement"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            action = 'réactivé' if user.is_active else 'suspendu'
            return Response({
                'message': f'Utilisateur {action} avec succès',
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminUserVerifyView(APIView):
    """Vérifier manuellement un utilisateur - admin uniquement"""
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_verified = not user.is_verified
            user.save()
            action = 'vérifié' if user.is_verified else 'non vérifié'
            return Response({
                'message': f'Utilisateur marqué comme {action}',
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Utilisateur non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )
