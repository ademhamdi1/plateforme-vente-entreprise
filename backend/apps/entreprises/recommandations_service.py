from django.db.models import Q, Count
from .models import Entreprise
from .statistiques_models import StatistiqueVue
from .favoris_models import Favori


class RecommandationService:
    """
    Service de recommandations d'entreprises basé sur:
    - Les secteurs d'activité consultés
    - La fourchette de prix consultée
    - Les entreprises favorites
    - L'historique des vues
    """
    
    @staticmethod
    def get_recommandations_pour_acheteur(user, limit=6):
        """
        Génère des recommandations personnalisées pour un acheteur
        """
        # 1. Récupérer les secteurs consultés
        secteurs_consultes = StatistiqueVue.objects.filter(
            utilisateur=user
        ).values_list('entreprise__secteur', flat=True).distinct()
        
        # 2. Récupérer les secteurs des favoris
        secteurs_favoris = Favori.objects.filter(
            utilisateur=user
        ).values_list('entreprise__secteur', flat=True).distinct()
        
        # Combiner les secteurs
        secteurs_interets = list(set(list(secteurs_consultes) + list(secteurs_favoris)))
        
        # 3. Calculer la fourchette de prix moyenne consultée
        prix_consultes = StatistiqueVue.objects.filter(
            utilisateur=user,
            entreprise__prix__isnull=False
        ).values_list('entreprise__prix', flat=True)
        
        prix_min = None
        prix_max = None
        
        if prix_consultes:
            prix_list = list(prix_consultes)
            prix_moyen = sum(prix_list) / len(prix_list)
            prix_min = prix_moyen * 0.7  # -30%
            prix_max = prix_moyen * 1.3  # +30%
        
        # 4. Exclure les entreprises déjà vues et favorites
        entreprises_vues = StatistiqueVue.objects.filter(
            utilisateur=user
        ).values_list('entreprise_id', flat=True)
        
        entreprises_favorites = Favori.objects.filter(
            utilisateur=user
        ).values_list('entreprise_id', flat=True)
        
        entreprises_exclues = list(set(list(entreprises_vues) + list(entreprises_favorites)))
        
        # 5. Construire la requête
        queryset = Entreprise.objects.filter(statut='publiee')
        
        # Exclure les entreprises déjà vues/favorites
        if entreprises_exclues:
            queryset = queryset.exclude(id__in=entreprises_exclues)
        
        # Filtrer par secteurs d'intérêt si disponible
        if secteurs_interets:
            queryset = queryset.filter(secteur__in=secteurs_interets)
        
        # Filtrer par fourchette de prix si disponible
        if prix_min and prix_max:
            queryset = queryset.filter(
                prix__gte=prix_min,
                prix__lte=prix_max
            )
        
        # 6. Trier par popularité (nombre de vues) et pertinence
        queryset = queryset.annotate(
            vues_count=Count('statistiques_vues')
        ).order_by('-mise_en_avant', '-vues_count', '-created_at')
        
        # Limiter les résultats
        recommandations = list(queryset[:limit])
        
        # 7. Si pas assez de recommandations, ajouter des entreprises populaires
        if len(recommandations) < limit:
            entreprises_populaires = Entreprise.objects.filter(
                statut='publiee'
            ).exclude(
                id__in=[e.id for e in recommandations] + entreprises_exclues
            ).annotate(
                vues_count=Count('statistiques_vues')
            ).order_by('-mise_en_avant', '-vues_count')[:limit - len(recommandations)]
            
            recommandations.extend(list(entreprises_populaires))
        
        return recommandations
    
    @staticmethod
    def get_entreprises_similaires(entreprise, limit=4):
        """
        Récupère des entreprises similaires à une entreprise donnée
        Basé sur: secteur, région, prix
        """
        prix_min = entreprise.prix * 0.7 if entreprise.prix else None
        prix_max = entreprise.prix * 1.3 if entreprise.prix else None
        
        queryset = Entreprise.objects.filter(
            statut='publiee'
        ).exclude(id=entreprise.id)
        
        # Même secteur en priorité
        similaires = queryset.filter(secteur=entreprise.secteur)
        
        # Même région si possible
        if similaires.count() > limit:
            similaires = similaires.filter(region=entreprise.region)
        
        # Fourchette de prix similaire
        if prix_min and prix_max:
            similaires_prix = similaires.filter(
                prix__gte=prix_min,
                prix__lte=prix_max
            )
            if similaires_prix.exists():
                similaires = similaires_prix
        
        return similaires.order_by('-mise_en_avant', '-nombre_vues')[:limit]
