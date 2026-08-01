from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import Entreprise
from .serializers import EntrepriseSerializer
from apps.users.notification_models import Notification


class IsAdmin(permissions.BasePermission):
    """Permission pour les administrateurs uniquement"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'admin'


class AdminEntreprisesEnAttenteView(generics.ListAPIView):
    """Liste des entreprises en attente de validation (admin only)"""
    serializer_class = EntrepriseSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return Entreprise.objects.filter(statut='en_attente').order_by('-created_at')


class AdminEntreprisesPublieesView(generics.ListAPIView):
    """Liste des entreprises publiées (admin only)"""
    serializer_class = EntrepriseSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        return Entreprise.objects.filter(statut='publiee').order_by('-published_at')


class AdminValiderEntrepriseView(APIView):
    """Valider une entreprise (admin only) - Save to PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def post(self, request, slug):
        try:
            entreprise = Entreprise.objects.get(slug=slug)
            
            # Update status in PostgreSQL
            entreprise.statut = 'publiee'
            entreprise.published_at = timezone.now()
            entreprise.raison_refus = ''
            entreprise.save()
            
            # Créer notification pour le vendeur dans PostgreSQL
            Notification.creer_notification(
                utilisateur=entreprise.vendeur,
                type_notif='entreprise_validee',
                titre='✅ Entreprise validée',
                message=f'Votre entreprise "{entreprise.nom}" a été validée et est maintenant publiée.',
                lien=f'/entreprises/{entreprise.slug}'
            )
            
            serializer = EntrepriseSerializer(entreprise)
            return Response({
                'message': 'Entreprise validée avec succès',
                'entreprise': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Entreprise.DoesNotExist:
            return Response(
                {'error': 'Entreprise non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminRefuserEntrepriseView(APIView):
    """Refuser une entreprise (admin only) - Save to PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def post(self, request, slug):
        try:
            entreprise = Entreprise.objects.get(slug=slug)
            raison = request.data.get('raison_refus', '')
            
            if not raison:
                return Response(
                    {'error': 'La raison du refus est obligatoire'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update status in PostgreSQL
            entreprise.statut = 'refusee'
            entreprise.raison_refus = raison
            entreprise.save()
            
            # Créer notification pour le vendeur dans PostgreSQL
            Notification.creer_notification(
                utilisateur=entreprise.vendeur,
                type_notif='entreprise_refusee',
                titre='❌ Entreprise refusée',
                message=f'Votre entreprise "{entreprise.nom}" a été refusée. Raison: {raison}',
                lien=f'/modifier/{entreprise.slug}'
            )
            
            serializer = EntrepriseSerializer(entreprise)
            return Response({
                'message': 'Entreprise refusée',
                'entreprise': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Entreprise.DoesNotExist:
            return Response(
                {'error': 'Entreprise non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminStatistiquesView(APIView):
    """Statistiques globales (admin only) - From PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def get(self, request):
        from apps.users.models import User
        
        stats = {
            'total_entreprises': Entreprise.objects.count(),
            'entreprises_publiees': Entreprise.objects.filter(statut='publiee').count(),
            'entreprises_en_attente': Entreprise.objects.filter(statut='en_attente').count(),
            'entreprises_refusees': Entreprise.objects.filter(statut='refusee').count(),
            'total_vendeurs': User.objects.filter(user_type='vendeur').count(),
            'total_acheteurs': User.objects.filter(user_type='acheteur').count(),
            'total_users': User.objects.count(),
        }
        
        return Response(stats, status=status.HTTP_200_OK)



class AdminMettreEnAvantView(APIView):
    """Mettre en avant une entreprise (admin only) - mis à jour dans PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def post(self, request, slug):
        try:
            entreprise = Entreprise.objects.get(slug=slug)
            duree_jours = request.data.get('duree_jours', 30)  # Durée par défaut: 30 jours
            
            # Vérifier que l'entreprise est publiée
            if entreprise.statut != 'publiee':
                return Response(
                    {'error': 'Seules les entreprises publiées peuvent être mises en avant'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Mettre en avant dans PostgreSQL
            from django.utils import timezone
            from datetime import timedelta
            
            entreprise.est_mise_en_avant = True
            entreprise.date_debut_mise_en_avant = timezone.now()
            entreprise.date_fin_mise_en_avant = timezone.now() + timedelta(days=int(duree_jours))
            entreprise.save()
            
            # Créer notification pour le vendeur
            Notification.creer_notification(
                utilisateur=entreprise.vendeur,
                type_notif='system',
                titre='⭐ Entreprise mise en avant',
                message=f'Votre entreprise "{entreprise.nom}" est mise en avant pour {duree_jours} jours.',
                lien=f'/entreprises/{entreprise.slug}'
            )
            
            serializer = EntrepriseSerializer(entreprise)
            return Response({
                'message': 'Entreprise mise en avant avec succès',
                'entreprise': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Entreprise.DoesNotExist:
            return Response(
                {'error': 'Entreprise non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )


class AdminRetirerMiseEnAvantView(APIView):
    """Retirer mise en avant d'une entreprise (admin only) - mis à jour dans PostgreSQL"""
    permission_classes = [IsAdmin]
    
    def post(self, request, slug):
        try:
            entreprise = Entreprise.objects.get(slug=slug)
            
            # Retirer mise en avant dans PostgreSQL
            entreprise.est_mise_en_avant = False
            entreprise.date_debut_mise_en_avant = None
            entreprise.date_fin_mise_en_avant = None
            entreprise.save()
            
            serializer = EntrepriseSerializer(entreprise)
            return Response({
                'message': 'Mise en avant retirée',
                'entreprise': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Entreprise.DoesNotExist:
            return Response(
                {'error': 'Entreprise non trouvée'},
                status=status.HTTP_404_NOT_FOUND
            )
