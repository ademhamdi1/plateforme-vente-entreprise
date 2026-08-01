from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum, Avg, Count, Q
from datetime import timedelta, date
from .models import Entreprise
from .statistiques_models import StatistiqueVue, StatistiqueAction, StatistiqueConversion
from .statistiques_serializers import (
    StatistiquesGlobalesSerializer,
    StatistiquesDashboardSerializer
)


class IsEntrepriseOwner(permissions.BasePermission):
    """Permission: seul le propriétaire peut voir les stats"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        slug = view.kwargs.get('slug')
        entreprise = get_object_or_404(Entreprise, slug=slug)
        return entreprise.vendeur == request.user


class StatistiquesEntrepriseView(APIView):
    """Statistiques détaillées d'une entreprise - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated, IsEntrepriseOwner]
    
    def get(self, request, slug):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        # Dates
        aujourd_hui = date.today()
        il_y_a_7_jours = aujourd_hui - timedelta(days=7)
        il_y_a_30_jours = aujourd_hui - timedelta(days=30)
        
        # Vues totales
        total_vues = entreprise.nombre_vues
        
        # Vues période
        vues_7_jours = StatistiqueVue.objects.filter(
            entreprise=entreprise,
            date__gte=il_y_a_7_jours
        ).aggregate(total=Sum('nombre_vues'))['total'] or 0
        
        vues_30_jours = StatistiqueVue.objects.filter(
            entreprise=entreprise,
            date__gte=il_y_a_30_jours
        ).aggregate(total=Sum('nombre_vues'))['total'] or 0
        
        # Contacts
        total_contacts = StatistiqueAction.objects.filter(
            entreprise=entreprise,
            action='contact'
        ).count()
        
        contacts_7_jours = StatistiqueAction.objects.filter(
            entreprise=entreprise,
            action='contact',
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Taux de conversion moyen
        conversions = StatistiqueConversion.objects.filter(entreprise=entreprise)
        taux_conversion_moyen = conversions.aggregate(
            avg=Avg('taux_conversion')
        )['avg'] or 0
        
        # Temps moyen sur page
        temps_moyen = StatistiqueVue.objects.filter(
            entreprise=entreprise
        ).aggregate(avg=Avg('temps_moyen_secondes'))['avg'] or 0
        
        # Favoris et partages
        total_favoris = StatistiqueAction.objects.filter(
            entreprise=entreprise,
            action='favori'
        ).count()
        
        total_partages = StatistiqueAction.objects.filter(
            entreprise=entreprise,
            action='partage'
        ).count()
        
        # Vues par jour (30 derniers jours)
        vues_par_jour = StatistiqueVue.objects.filter(
            entreprise=entreprise,
            date__gte=il_y_a_30_jours
        ).order_by('date')
        
        # Conversions par jour
        conversions_par_jour = StatistiqueConversion.objects.filter(
            entreprise=entreprise,
            date__gte=il_y_a_30_jours
        ).order_by('date')
        
        # Actions récentes
        actions_recentes = StatistiqueAction.objects.filter(
            entreprise=entreprise
        )[:20]
        
        data = {
            'total_vues': total_vues,
            'vues_7_jours': vues_7_jours,
            'vues_30_jours': vues_30_jours,
            'total_contacts': total_contacts,
            'contacts_7_jours': contacts_7_jours,
            'taux_conversion_moyen': round(taux_conversion_moyen, 2),
            'temps_moyen_page': int(temps_moyen),
            'total_favoris': total_favoris,
            'total_partages': total_partages,
            'vues_par_jour': vues_par_jour,
            'conversions_par_jour': conversions_par_jour,
            'actions_recentes': actions_recentes,
        }
        
        serializer = StatistiquesGlobalesSerializer(data)
        return Response(serializer.data)


class StatistiquesDashboardVendeurView(APIView):
    """Vue d'ensemble des stats pour toutes les entreprises du vendeur - depuis PostgreSQL"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Vérifier que l'utilisateur est vendeur
        if request.user.user_type != 'vendeur':
            return Response(
                {'error': 'Seuls les vendeurs peuvent accéder aux statistiques'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        entreprises = Entreprise.objects.filter(vendeur=request.user)
        
        stats_list = []
        
        for entreprise in entreprises:
            aujourd_hui = date.today()
            il_y_a_7_jours = aujourd_hui - timedelta(days=7)
            il_y_a_14_jours = aujourd_hui - timedelta(days=14)
            
            # Vues cette semaine
            vues_semaine = StatistiqueVue.objects.filter(
                entreprise=entreprise,
                date__gte=il_y_a_7_jours
            ).aggregate(total=Sum('nombre_vues'))['total'] or 0
            
            # Vues semaine précédente
            vues_semaine_precedente = StatistiqueVue.objects.filter(
                entreprise=entreprise,
                date__gte=il_y_a_14_jours,
                date__lt=il_y_a_7_jours
            ).aggregate(total=Sum('nombre_vues'))['total'] or 0
            
            # Évolution
            if vues_semaine_precedente > 0:
                evolution = ((vues_semaine - vues_semaine_precedente) / vues_semaine_precedente) * 100
            else:
                evolution = 100 if vues_semaine > 0 else 0
            
            # Contacts
            total_contacts = StatistiqueAction.objects.filter(
                entreprise=entreprise,
                action='contact'
            ).count()
            
            # Taux de conversion
            if entreprise.nombre_vues > 0:
                taux_conversion = (total_contacts / entreprise.nombre_vues) * 100
            else:
                taux_conversion = 0
            
            stats_list.append({
                'entreprise_slug': entreprise.slug,
                'entreprise_nom': entreprise.nom,
                'total_vues': entreprise.nombre_vues,
                'vues_semaine': vues_semaine,
                'total_contacts': total_contacts,
                'taux_conversion': round(taux_conversion, 2),
                'evolution_vues': round(evolution, 2),
            })
        
        serializer = StatistiquesDashboardSerializer(stats_list, many=True)
        return Response(serializer.data)


class EnregistrerActionView(APIView):
    """Enregistrer une action utilisateur - sauvegardée dans PostgreSQL"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, slug):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        action = request.data.get('action', 'vue')
        
        # Récupérer IP et User Agent
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:255]
        
        # Créer l'action dans PostgreSQL
        StatistiqueAction.objects.create(
            entreprise=entreprise,
            utilisateur=request.user if request.user.is_authenticated else None,
            action=action,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        # Mettre à jour les stats du jour
        aujourd_hui = date.today()
        stat_vue, created = StatistiqueVue.objects.get_or_create(
            entreprise=entreprise,
            date=aujourd_hui
        )
        
        if action == 'vue':
            stat_vue.nombre_vues += 1
            stat_vue.save()
        
        # Mettre à jour conversion si c'est un contact
        if action == 'contact':
            stat_conversion, created = StatistiqueConversion.objects.get_or_create(
                entreprise=entreprise,
                date=aujourd_hui
            )
            stat_conversion.nombre_contacts += 1
            stat_conversion.nombre_vues = stat_vue.nombre_vues
            stat_conversion.calculer_taux()
        
        return Response({'message': 'Action enregistrée'})
    
    def get_client_ip(self, request):
        """Récupérer l'IP du client"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
