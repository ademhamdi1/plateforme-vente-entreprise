from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .recommandations_service import RecommandationService
from .serializers import EntrepriseSerializer


class RecommandationsAcheteurView(APIView):
    """
    API pour obtenir des recommandations personnalisées pour un acheteur
    Basé sur l'historique de navigation, les favoris et les préférences
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Vérifier que l'utilisateur est un acheteur
        if request.user.user_type != 'acheteur':
            return Response({
                'recommandations': [],
                'message': 'Les recommandations sont disponibles pour les acheteurs uniquement'
            })
        
        # Obtenir le nombre de recommandations demandé
        limit = int(request.query_params.get('limit', 6))
        limit = min(limit, 12)  # Maximum 12 recommandations
        
        # Générer les recommandations depuis PostgreSQL
        recommandations = RecommandationService.get_recommandations_pour_acheteur(
            request.user,
            limit=limit
        )
        
        serializer = EntrepriseSerializer(recommandations, many=True, context={'request': request})
        
        return Response({
            'recommandations': serializer.data,
            'count': len(recommandations)
        })


class EntreprisesSimilairesView(APIView):
    """
    API pour obtenir des entreprises similaires à une entreprise donnée
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, slug):
        from .models import Entreprise
        
        try:
            entreprise = Entreprise.objects.get(slug=slug, statut='publiee')
        except Entreprise.DoesNotExist:
            return Response({'error': 'Entreprise non trouvée'}, status=404)
        
        # Obtenir le nombre de suggestions demandé
        limit = int(request.query_params.get('limit', 4))
        limit = min(limit, 8)  # Maximum 8 suggestions
        
        # Récupérer les entreprises similaires depuis PostgreSQL
        similaires = RecommandationService.get_entreprises_similaires(
            entreprise,
            limit=limit
        )
        
        serializer = EntrepriseSerializer(similaires, many=True, context={'request': request})
        
        return Response({
            'similaires': serializer.data,
            'count': len(similaires)
        })
