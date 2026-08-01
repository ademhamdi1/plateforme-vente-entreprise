from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .contact_models import ContactMessage
from .contact_serializers import ContactMessageSerializer
from .email_service import EmailService


class ContactMessageView(APIView):
    """
    Vue pour créer un message de contact
    Accessible à tous (authentifiés ou non)
    Envoie un email de confirmation
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            contact_message = serializer.save()
            
            # Envoyer email de confirmation (asynchrone)
            try:
                EmailService.send_contact_confirmation_email(contact_message)
            except Exception as e:
                # Ne pas bloquer si l'email échoue
                print(f"Erreur envoi email: {e}")
            
            return Response({
                'message': 'Votre message a été envoyé avec succès!',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'error': 'Données invalides',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
