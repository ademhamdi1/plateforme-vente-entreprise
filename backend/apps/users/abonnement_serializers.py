from rest_framework import serializers
from .abonnement_models import Abonnement, HistoriquePaiement


class AbonnementSerializer(serializers.ModelSerializer):
    jours_restants = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    plan_display = serializers.CharField(source='get_plan_display', read_only=True)
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    
    class Meta:
        model = Abonnement
        fields = [
            'id', 'plan', 'plan_display', 'statut', 'statut_display',
            'date_debut', 'date_fin', 'auto_renouvellement',
            'max_annonces', 'annonces_mises_en_avant', 'statistiques_avancees',
            'badge_verifie', 'support_prioritaire',
            'jours_restants', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_jours_restants(self, obj):
        return obj.jours_restants()
    
    def get_is_active(self, obj):
        return obj.is_active()


class HistoriquePaiementSerializer(serializers.ModelSerializer):
    statut_display = serializers.CharField(source='get_statut_display', read_only=True)
    
    class Meta:
        model = HistoriquePaiement
        fields = [
            'id', 'montant', 'devise', 'plan', 'duree_mois',
            'statut', 'statut_display', 'transaction_id',
            'methode_paiement', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class UpgradeAbonnementSerializer(serializers.Serializer):
    """Serializer pour upgrade d'abonnement"""
    plan = serializers.ChoiceField(choices=['premium', 'professionnel'])
    duree_mois = serializers.IntegerField(min_value=1, max_value=12, default=1)
    methode_paiement = serializers.CharField(max_length=50, required=False)


class PlansAbonnementSerializer(serializers.Serializer):
    """Serializer pour afficher les plans disponibles"""
    plan = serializers.CharField()
    nom = serializers.CharField()
    prix_mensuel = serializers.DecimalField(max_digits=10, decimal_places=2)
    max_annonces = serializers.IntegerField()
    annonces_mises_en_avant = serializers.BooleanField()
    statistiques_avancees = serializers.BooleanField()
    badge_verifie = serializers.BooleanField()
    support_prioritaire = serializers.BooleanField()
    features = serializers.ListField(child=serializers.CharField())
