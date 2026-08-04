from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .models import User
from .serializers import UserSerializer, UserRegistrationSerializer


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST'), name='post')
class UserLoginView(APIView):
    """Vue de connexion personnalisée acceptant email au lieu de username"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email') or request.data.get('username')  # Accept both
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'detail': 'Email et mot de passe requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'Aucun compte actif n\'a été trouvé avec les identifiants fournis'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {'detail': 'Aucun compte actif n\'a été trouvé avec les identifiants fournis'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'detail': 'Ce compte a été désactivé'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'user_type': user.user_type,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_verified': user.is_verified,
            }
        }, status=status.HTTP_200_OK)


@method_decorator(ratelimit(key='ip', rate='3/h', method='POST'), name='post')
class UserRegistrationView(generics.CreateAPIView):
    """Inscription d'un nouvel utilisateur"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Profil de l'utilisateur connecté"""
    serializer_class = UserSerializer
    permissions_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
