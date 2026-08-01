"""
Vues pour la vérification d'email et reset password
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .email_service import EmailService

User = get_user_model()


@method_decorator(ratelimit(key='ip', rate='3/h', method='POST'), name='post')
class SendVerificationEmailView(APIView):
    """
    Envoyer un email de vérification
    POST /api/users/send-verification-email/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            
            if user.is_verified:
                return Response(
                    {'message': 'Cet email est déjà vérifié'},
                    status=status.HTTP_200_OK
                )
            
            # Générer le token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Envoyer l'email
            EmailService.send_verification_email(user, uid, token)
            
            return Response({
                'message': 'Email de vérification envoyé avec succès',
                'email': email
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response(
                {'error': 'Aucun utilisateur avec cet email'},
                status=status.HTTP_404_NOT_FOUND
            )


class VerifyEmailView(APIView):
    """
    Vérifier l'email avec le token
    GET /api/users/verify-email/<uidb64>/<token>/
    """
    permission_classes = [AllowAny]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Lien de vérification invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if default_token_generator.check_token(user, token):
            user.is_verified = True
            user.save()
            
            return Response({
                'message': 'Email vérifié avec succès!',
                'email': user.email
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Le lien de vérification a expiré ou est invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST'), name='post')
class RequestPasswordResetView(APIView):
    """
    Demander un reset de mot de passe
    POST /api/users/password-reset-request/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
            
            # Générer le token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Envoyer l'email avec gestion des erreurs
            try:
                EmailService.send_password_reset_email(user, uid, token)
                print(f"✅ Password reset email sent to {email}")
            except Exception as e:
                print(f"❌ Error sending email: {str(e)}")
                # Continue anyway for security (don't reveal if email exists)
            
            return Response({
                'message': 'Email de réinitialisation envoyé avec succès',
                'email': email
            }, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            # Ne pas révéler si l'email existe ou non (sécurité)
            return Response({
                'message': 'Si cet email existe, un lien de réinitialisation a été envoyé',
            }, status=status.HTTP_200_OK)


@method_decorator(ratelimit(key='ip', rate='5/h', method='POST'), name='post')
class PasswordResetConfirmView(APIView):
    """
    Confirmer le reset de mot de passe avec nouveau password
    POST /api/users/password-reset-confirm/
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uidb64, token, new_password]):
            return Response(
                {'error': 'Tous les champs sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 8:
            return Response(
                {'error': 'Le mot de passe doit contenir au moins 8 caractères'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {'error': 'Lien de réinitialisation invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.save()
            
            return Response({
                'message': 'Mot de passe réinitialisé avec succès!',
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Le lien de réinitialisation a expiré ou est invalide'},
                status=status.HTTP_400_BAD_REQUEST
            )
