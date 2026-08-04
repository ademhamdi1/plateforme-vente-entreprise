"""Custom FilterSet for Entreprise search with friendly URL param names."""
import django_filters
from .models import Entreprise


class EntrepriseFilter(django_filters.FilterSet):
    """Advanced search filters mapping clean param names to model fields."""
    # Price range
    prix_min = django_filters.NumberFilter(field_name='prix_demande', lookup_expr='gte')
    prix_max = django_filters.NumberFilter(field_name='prix_demande', lookup_expr='lte')
    # Revenue range
    ca_min = django_filters.NumberFilter(field_name='chiffre_affaires', lookup_expr='gte')
    ca_max = django_filters.NumberFilter(field_name='chiffre_affaires', lookup_expr='lte')
    # Employees range
    employes_min = django_filters.NumberFilter(field_name='nombre_employes', lookup_expr='gte')
    employes_max = django_filters.NumberFilter(field_name='nombre_employes', lookup_expr='lte')
    # Year range
    annee_min = django_filters.NumberFilter(field_name='annee_creation', lookup_expr='gte')
    annee_max = django_filters.NumberFilter(field_name='annee_creation', lookup_expr='lte')

    class Meta:
        model = Entreprise
        fields = ['secteur', 'region', 'type_transaction']
