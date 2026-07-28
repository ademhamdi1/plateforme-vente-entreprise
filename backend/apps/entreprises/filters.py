import django_filters
from .models import Entreprise


class EntrepriseFilter(django_filters.FilterSet):
    """
    Filtre pour la recherche avancée d'entreprises
    """
    prix_min = django_filters.NumberFilter(field_name='prix_demande', lookup_expr='gte')
    prix_max = django_filters.NumberFilter(field_name='prix_demande', lookup_expr='lte')
    ca_min = django_filters.NumberFilter(field_name='chiffre_affaires', lookup_expr='gte')
    ca_max = django_filters.NumberFilter(field_name='chiffre_affaires', lookup_expr='lte')
    resultat_min = django_filters.NumberFilter(field_name='resultat_net', lookup_expr='gte')
    resultat_max = django_filters.NumberFilter(field_name='resultat_net', lookup_expr='lte')
    employes_min = django_filters.NumberFilter(field_name='nombre_employes', lookup_expr='gte')
    employes_max = django_filters.NumberFilter(field_name='nombre_employes', lookup_expr='lte')
    annee_min = django_filters.NumberFilter(field_name='annee_creation', lookup_expr='gte')
    annee_max = django_filters.NumberFilter(field_name='annee_creation', lookup_expr='lte')
    
    class Meta:
        model = Entreprise
        fields = {
            'secteur': ['exact'],
            'region': ['exact'],
            'type_transaction': ['exact'],
            'statut': ['exact'],
        }
