"""
Vue pour enregistrer les paiements DEMO dans PostgreSQL
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from .abonnement_models import Abonnement, HistoriquePaiement


class DemoPaymentView(APIView):
    """
    Enregistrer un paiement DEMO dans PostgreSQL
    POST /users/payment/demo/
    """
    permission_classes = [IsAuthenticated]
    
    # Prix des plans
    PLAN_PRICES = {
        'basic': {'monthly': 29.99, 'annual': 239.92},
        'premium': {'monthly': 49.99, 'annual': 479.90},
        'professionnel': {'monthly': 99.99, 'annual': 959.90},
    }
    
    def post(self, request):
        plan = request.data.get('plan')  # basic, premium, professionnel
        period = request.data.get('period', 'monthly')  # monthly, annual
        
        if not plan or plan not in ['basic', 'premium', 'professionnel']:
            return Response({
                'error': 'Plan invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if period not in ['monthly', 'annual']:
            return Response({
                'error': 'Période invalide'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = request.user
            
            # Calculer les dates
            date_debut = timezone.now()
            if period == 'monthly':
                date_fin = date_debut + timedelta(days=30)
                duree_mois = 1
            else:  # annual
                date_fin = date_debut + timedelta(days=365)
                duree_mois = 12
            
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
            montant = Decimal(str(self.PLAN_PRICES[plan][period]))
            paiement = HistoriquePaiement.objects.create(
                utilisateur=user,
                abonnement=abonnement,
                montant=montant,
                devise='TND',
                statut='complete',
                methode_paiement='demo',
                transaction_id=f'DEMO-{timezone.now().timestamp()}',
                plan=plan,
                duree_mois=duree_mois,
            )
            
            return Response({
                'message': 'Paiement DEMO enregistré avec succès',
                'abonnement': {
                    'plan': abonnement.plan,
                    'statut': abonnement.statut,
                    'date_debut': abonnement.date_debut,
                    'date_fin': abonnement.date_fin,
                },
                'paiement': {
                    'id': paiement.id,
                    'montant': str(paiement.montant),
                    'devise': paiement.devise,
                    'transaction_id': paiement.transaction_id,
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'error': f'Erreur lors de l\'enregistrement: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
