"""
Service de paiement Stripe
Gère les abonnements et paiements - Données sauvegardées dans PostgreSQL
"""
import stripe
from django.conf import settings
from decimal import Decimal
from .abonnement_models import Abonnement, HistoriquePaiement

# Configuration Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePaymentService:
    """Service pour gérer les paiements Stripe"""
    
    PLAN_PRICES = {
        'basic': {'monthly': 29.99, 'annual': 299.99},
        'premium': {'monthly': 79.99, 'annual': 799.99},
        'enterprise': {'monthly': 199.99, 'annual': 1999.99},
    }
    
    @classmethod
    def create_checkout_session(cls, user, plan, period='monthly', success_url='', cancel_url=''):
        """
        Créer une session de paiement Stripe Checkout
        
        Args:
            user: User instance
            plan: 'basic', 'premium', 'enterprise'
            period: 'monthly' ou 'annual'
            success_url: URL de redirection après succès
            cancel_url: URL de redirection après annulation
        
        Returns:
            dict avec session_id et checkout_url
        """
        try:
            # Montant en centimes (Stripe utilise les centimes)
            amount = int(cls.PLAN_PRICES[plan][period] * 100)
            
            # Créer la session Checkout
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'tnd',
                        'unit_amount': amount,
                        'product_data': {
                            'name': f'Abonnement {plan.title()} - {period.title()}',
                            'description': f'Plateforme Vente Entreprises Tunisie',
                        },
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=str(user.id),
                metadata={
                    'user_id': user.id,
                    'plan': plan,
                    'period': period,
                },
            )
            
            return {
                'session_id': session.id,
                'checkout_url': session.url,
            }
            
        except stripe.error.StripeError as e:
            raise Exception(f'Erreur Stripe: {str(e)}')
    
    @classmethod
    def create_payment_intent(cls, user, plan, period='monthly'):
        """
        Créer un Payment Intent Stripe (méthode alternative)
        
        Args:
            user: User instance
            plan: 'basic', 'premium', 'enterprise'
            period: 'monthly' ou 'annual'
        
        Returns:
            dict avec client_secret
        """
        try:
            amount = int(cls.PLAN_PRICES[plan][period] * 100)
            
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='tnd',
                metadata={
                    'user_id': user.id,
                    'plan': plan,
                    'period': period,
                },
            )
            
            return {
                'client_secret': intent.client_secret,
                'payment_intent_id': intent.id,
            }
            
        except stripe.error.StripeError as e:
            raise Exception(f'Erreur Stripe: {str(e)}')
    
    @classmethod
    def handle_successful_payment(cls, payment_intent_id, metadata):
        """
        Traiter un paiement réussi et créer/mettre à jour l'abonnement
        Sauvegarde dans PostgreSQL
        
        Args:
            payment_intent_id: ID du payment intent Stripe
            metadata: Données du paiement (user_id, plan, period)
        
        Returns:
            Abonnement instance
        """
        from django.contrib.auth import get_user_model
        from django.utils import timezone
        from datetime import timedelta
        
        User = get_user_model()
        user = User.objects.get(id=metadata['user_id'])
        plan = metadata['plan']
        period = metadata.get('period', 'monthly')
        
        # Calculer les dates
        date_debut = timezone.now()
        if period == 'monthly':
            date_fin = date_debut + timedelta(days=30)
        else:  # annual
            date_fin = date_debut + timedelta(days=365)
        
        # Créer ou mettre à jour l'abonnement dans PostgreSQL
        abonnement, created = Abonnement.objects.update_or_create(
            utilisateur=user,
            defaults={
                'plan': plan,
                'statut': 'actif',
                'date_debut': date_debut,
                'date_fin': date_fin,
                'auto_renouvellement': True,
            }
        )
        
        # Créer l'historique de paiement dans PostgreSQL
        montant = Decimal(cls.PLAN_PRICES[plan][period])
        HistoriquePaiement.objects.create(
            utilisateur=user,
            abonnement=abonnement,
            montant=montant,
            devise='TND',
            statut='complete',
            methode_paiement='stripe',
            transaction_id=payment_intent_id,
            plan=plan,
        )
        
        return abonnement
    
    @classmethod
    def cancel_subscription(cls, user):
        """
        Annuler l'abonnement d'un utilisateur
        Mise à jour dans PostgreSQL
        """
        try:
            abonnement = Abonnement.objects.get(utilisateur=user, statut='actif')
            abonnement.statut = 'annule'
            abonnement.auto_renouvellement = False
            abonnement.save()
            
            return True
            
        except Abonnement.DoesNotExist:
            return False
    
    @classmethod
    def get_plan_price(cls, plan, period='monthly'):
        """Obtenir le prix d'un plan"""
        return cls.PLAN_PRICES.get(plan, {}).get(period, 0)
