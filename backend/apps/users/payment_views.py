"""
Vues pour gérer les paiements Stripe
Toutes les données sauvegardées dans PostgreSQL
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import stripe
import json

from .payment_service import StripePaymentService

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    """
    Créer une session de paiement Stripe Checkout
    POST /users/payment/create-checkout-session/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        plan = request.data.get('plan')  # basic, premium, enterprise
        period = request.data.get('period', 'monthly')  # monthly, annual
        
        if not plan or plan not in ['basic', 'premium', 'enterprise']:
            return Response({
                'error': 'Plan invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if period not in ['monthly', 'annual']:
            return Response({
                'error': 'Période invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # URLs de redirection
            frontend_url = settings.CORS_ALLOWED_ORIGINS[0]
            success_url = f'{frontend_url}/abonnement/success?session_id={{CHECKOUT_SESSION_ID}}'
            cancel_url = f'{frontend_url}/abonnement?cancelled=true'
            
            # Créer la session Stripe
            result = StripePaymentService.create_checkout_session(
                user=request.user,
                plan=plan,
                period=period,
                success_url=success_url,
                cancel_url=cancel_url
            )
            
            return Response({
                'sessionId': result['session_id'],
                'checkoutUrl': result['checkout_url'],
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreatePaymentIntentView(APIView):
    """
    Créer un Payment Intent (méthode alternative)
    POST /users/payment/create-payment-intent/
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        plan = request.data.get('plan')
        period = request.data.get('period', 'monthly')
        
        if not plan or plan not in ['basic', 'premium', 'enterprise']:
            return Response({
                'error': 'Plan invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = StripePaymentService.create_payment_intent(
                user=request.user,
                plan=plan,
                period=period
            )
            
            return Response({
                'clientSecret': result['client_secret'],
                'paymentIntentId': result['payment_intent_id'],
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StripeWebhookView(APIView):
    """
    Webhook Stripe pour recevoir les événements de paiement
    POST /users/payment/webhook/
    
    Sauvegarde les paiements dans PostgreSQL
    """
    permission_classes = []  # Pas d'auth, vérifié par signature Stripe
    
    def post(self, request):
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        try:
            # Vérifier la signature du webhook
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )
            
        except ValueError:
            return Response({'error': 'Invalid payload'}, status=400)
        except stripe.error.SignatureVerificationError:
            return Response({'error': 'Invalid signature'}, status=400)
        
        # Gérer les différents types d'événements
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            self._handle_checkout_completed(session)
            
        elif event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            self._handle_payment_succeeded(payment_intent)
            
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            self._handle_payment_failed(payment_intent)
        
        return Response({'status': 'success'}, status=200)
    
    def _handle_checkout_completed(self, session):
        """Gérer la complétion d'un checkout"""
        metadata = session.get('metadata', {})
        payment_intent_id = session.get('payment_intent')
        
        # Créer l'abonnement dans PostgreSQL
        StripePaymentService.handle_successful_payment(
            payment_intent_id=payment_intent_id,
            metadata=metadata
        )
    
    def _handle_payment_succeeded(self, payment_intent):
        """Gérer un paiement réussi"""
        metadata = payment_intent.get('metadata', {})
        
        # Créer l'abonnement dans PostgreSQL
        StripePaymentService.handle_successful_payment(
            payment_intent_id=payment_intent['id'],
            metadata=metadata
        )
    
    def _handle_payment_failed(self, payment_intent):
        """Gérer un paiement échoué"""
        from .abonnement_models import HistoriquePaiement
        from django.contrib.auth import get_user_model
        
        User = get_user_model()
        metadata = payment_intent.get('metadata', {})
        
        if 'user_id' in metadata:
            user = User.objects.get(id=metadata['user_id'])
            
            # Enregistrer l'échec dans PostgreSQL
            HistoriquePaiement.objects.create(
                utilisateur=user,
                montant=payment_intent['amount'] / 100,
                devise=payment_intent['currency'].upper(),
                statut='echec',
                methode_paiement='stripe',
                transaction_id=payment_intent['id'],
                plan=metadata.get('plan', ''),
            )


class GetStripePublicKeyView(APIView):
    """
    Obtenir la clé publique Stripe pour le frontend
    GET /users/payment/public-key/
    """
    permission_classes = []
    
    def get(self, request):
        return Response({
            'publicKey': settings.STRIPE_PUBLIC_KEY
        }, status=200)
