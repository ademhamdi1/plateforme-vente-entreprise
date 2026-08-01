from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from .abonnement_models import Abonnement, HistoriquePaiement
from .abonnement_serializers import (
    AbonnementSerializer,
    HistoriquePaiementSerializer,
    UpgradeAbonnementSerializer,
    PlansAbonnementSerializer
)
from .facture_service import FactureService


class MonAbonnementView(generics.RetrieveAPIView):
    """Voir mon abonnement actuel - depuis PostgreSQL"""
    serializer_class = AbonnementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        # Créer un abonnement gratuit si n'existe pas
        abonnement, created = Abonnement.objects.get_or_create(
            utilisateur=self.request.user,
            defaults={
                'plan': 'gratuit',
                'statut': 'actif',
                'max_annonces': 2,
            }
        )
        return abonnement


class PlansDisponiblesView(APIView):
    """Liste des plans d'abonnement disponibles"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        plans = [
            {
                'plan': 'gratuit',
                'nom': 'Gratuit',
                'prix_mensuel': 0,
                'max_annonces': 2,
                'annonces_mises_en_avant': False,
                'statistiques_avancees': False,
                'badge_verifie': False,
                'support_prioritaire': False,
                'features': [
                    '2 annonces maximum',
                    'Visibilité standard',
                    'Messagerie de base',
                    'Photos et documents',
                ]
            },
            {
                'plan': 'premium',
                'nom': 'Premium',
                'prix_mensuel': 49.99,
                'max_annonces': 10,
                'annonces_mises_en_avant': True,
                'statistiques_avancees': True,
                'badge_verifie': False,
                'support_prioritaire': True,
                'features': [
                    '10 annonces maximum',
                    'Mise en avant des annonces',
                    'Statistiques avancées',
                    'Support prioritaire',
                    'Badge Premium',
                ]
            },
            {
                'plan': 'professionnel',
                'nom': 'Professionnel',
                'prix_mensuel': 99.99,
                'max_annonces': 999,
                'annonces_mises_en_avant': True,
                'statistiques_avancees': True,
                'badge_verifie': True,
                'support_prioritaire': True,
                'features': [
                    'Annonces illimitées',
                    'Publicité premium',
                    'Badge vérifié',
                    'Statistiques détaillées',
                    'Support dédié 24/7',
                    'Accompagnement personnalisé',
                ]
            }
        ]
        
        serializer = PlansAbonnementSerializer(plans, many=True)
        return Response(serializer.data)


class UpgradeAbonnementView(APIView):
    """Upgrade d'abonnement - sauvegardé dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = UpgradeAbonnementSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        plan = serializer.validated_data['plan']
        duree_mois = serializer.validated_data['duree_mois']
        methode_paiement = serializer.validated_data.get('methode_paiement', 'test')
        
        # Calculer le montant
        prix_map = {
            'premium': 49.99,
            'professionnel': 99.99
        }
        montant = prix_map[plan] * duree_mois
        
        # Créer l'historique de paiement (en attente)
        paiement = HistoriquePaiement.objects.create(
            utilisateur=request.user,
            montant=montant,
            devise='TND',
            plan=plan,
            duree_mois=duree_mois,
            statut='en_attente',
            methode_paiement=methode_paiement
        )
        
        # TODO: Intégrer avec un vrai gateway de paiement
        # Pour l'instant, on simule un paiement réussi
        paiement.statut = 'reussi'
        paiement.transaction_id = f'TEST_{paiement.id}'
        paiement.save()
        
        # Upgrade l'abonnement dans PostgreSQL
        if plan == 'premium':
            abonnement = Abonnement.upgrade_to_premium(request.user, duree_mois)
        else:
            abonnement = Abonnement.upgrade_to_professionnel(request.user, duree_mois)
        
        paiement.abonnement = abonnement
        paiement.save()
        
        return Response({
            'message': f'Abonnement {plan} activé avec succès',
            'abonnement': AbonnementSerializer(abonnement).data,
            'paiement': HistoriquePaiementSerializer(paiement).data
        }, status=status.HTTP_200_OK)


class AnnulerAbonnementView(APIView):
    """Annuler l'abonnement - mis à jour dans PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            abonnement = Abonnement.objects.get(utilisateur=request.user)
            
            if abonnement.plan == 'gratuit':
                return Response(
                    {'error': 'Vous avez déjà un abonnement gratuit'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Annuler le renouvellement automatique
            abonnement.auto_renouvellement = False
            abonnement.save()
            
            return Response({
                'message': 'Le renouvellement automatique a été annulé. Votre abonnement restera actif jusqu\'à la date de fin.',
                'abonnement': AbonnementSerializer(abonnement).data
            })
            
        except Abonnement.DoesNotExist:
            return Response(
                {'error': 'Aucun abonnement trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class HistoriquePaiementsView(generics.ListAPIView):
    """Historique des paiements - depuis PostgreSQL"""
    serializer_class = HistoriquePaiementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return HistoriquePaiement.objects.filter(utilisateur=self.request.user)


class TelechargerFactureView(APIView):
    """Télécharger la facture PDF d'un paiement"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, paiement_id):
        try:
            # Vérifier que le paiement appartient à l'utilisateur
            paiement = HistoriquePaiement.objects.get(
                id=paiement_id,
                utilisateur=request.user,
                statut='reussi'
            )
            
            # Générer le PDF
            pdf_buffer = FactureService.generer_facture_pdf(paiement)
            
            # Retourner le PDF
            response = HttpResponse(pdf_buffer, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="facture_{paiement.id}.pdf"'
            return response
            
        except HistoriquePaiement.DoesNotExist:
            return Response(
                {'error': 'Facture non trouvée ou paiement non complété'},
                status=status.HTTP_404_NOT_FOUND
            )
