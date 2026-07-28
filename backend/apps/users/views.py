from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, SavedEntreprise, Alert
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    SavedEntrepriseSerializer,
    AlertSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """
    Vue pour l'inscription d'un nouvel utilisateur
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Vue pour récupérer et mettre à jour le profil utilisateur
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class SavedEntrepriseListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et sauvegarder des entreprises
    """
    serializer_class = SavedEntrepriseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedEntreprise.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SavedEntrepriseDeleteView(generics.DestroyAPIView):
    """
    Vue pour supprimer une entreprise sauvegardée
    """
    serializer_class = SavedEntrepriseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedEntreprise.objects.filter(user=self.request.user)


class AlertListCreateView(generics.ListCreateAPIView):
    """
    Vue pour lister et créer des alertes
    """
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour récupérer, mettre à jour et supprimer une alerte
    """
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)


class ChangePasswordView(APIView):
    """
    Vue pour changer le mot de passe de l'utilisateur
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not old_password or not new_password:
            return Response(
                {'detail': 'Ancien et nouveau mot de passe requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier l'ancien mot de passe
        if not user.check_password(old_password):
            return Response(
                {'detail': 'Mot de passe actuel incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Valider le nouveau mot de passe
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            # Formater les messages d'erreur en français
            error_messages = []
            for message in e.messages:
                # Traduire les messages courants
                if 'too short' in message.lower():
                    error_messages.append('Le mot de passe doit contenir au moins 8 caractères')
                elif 'too common' in message.lower():
                    error_messages.append('Ce mot de passe est trop courant')
                elif 'entirely numeric' in message.lower():
                    error_messages.append('Le mot de passe ne peut pas être entièrement numérique')
                elif 'similar' in message.lower():
                    error_messages.append('Le mot de passe est trop similaire à vos informations personnelles')
                else:
                    error_messages.append(message)
            
            return Response(
                {'detail': ' | '.join(error_messages)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Changer le mot de passe
        user.set_password(new_password)
        user.save()
        
        return Response(
            {'detail': 'Mot de passe changé avec succès'},
            status=status.HTTP_200_OK
        )
