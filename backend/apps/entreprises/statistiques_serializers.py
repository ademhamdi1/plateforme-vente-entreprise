from rest_framework import serializers
from .statistiques_models import StatistiqueVue, StatistiqueAction, StatistiqueConversion


class StatistiqueVueSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatistiqueVue
        fields = ['id', 'date', 'nombre_vues', 'nombre_vues_uniques', 'temps_moyen_secondes']
        read_only_fields = ['id']


class StatistiqueActionSerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = StatistiqueAction
        fields = ['id', 'action', 'action_display', 'created_at']
        read_only_fields = ['id', 'created_at']


class StatistiqueConversionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatistiqueConversion
        fields = ['id', 'date', 'nombre_vues', 'nombre_contacts', 'taux_conversion']
        read_only_fields = ['id', 'taux_conversion']


class StatistiquesGlobalesSerializer(serializers.Serializer):
    """Statistiques globales d'une entreprise"""
    total_vues = serializers.IntegerField()
    vues_7_jours = serializers.IntegerField()
    vues_30_jours = serializers.IntegerField()
    total_contacts = serializers.IntegerField()
    contacts_7_jours = serializers.IntegerField()
    taux_conversion_moyen = serializers.DecimalField(max_digits=5, decimal_places=2)
    temps_moyen_page = serializers.IntegerField()
    total_favoris = serializers.IntegerField()
    total_partages = serializers.IntegerField()
    vues_par_jour = StatistiqueVueSerializer(many=True)
    conversions_par_jour = StatistiqueConversionSerializer(many=True)
    actions_recentes = StatistiqueActionSerializer(many=True)


class StatistiquesDashboardSerializer(serializers.Serializer):
    """Vue d'ensemble pour le dashboard vendeur"""
    entreprise_slug = serializers.CharField()
    entreprise_nom = serializers.CharField()
    total_vues = serializers.IntegerField()
    vues_semaine = serializers.IntegerField()
    total_contacts = serializers.IntegerField()
    taux_conversion = serializers.DecimalField(max_digits=5, decimal_places=2)
    evolution_vues = serializers.DecimalField(max_digits=5, decimal_places=2)  # % vs semaine précédente
