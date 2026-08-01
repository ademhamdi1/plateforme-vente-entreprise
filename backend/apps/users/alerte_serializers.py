from rest_framework import serializers
from .alerte_models import AlerteRecherche


class AlerteRechercheSerializer(serializers.ModelSerializer):
    acheteur_nom = serializers.CharField(source='acheteur.get_full_name', read_only=True)
    frequence_display = serializers.CharField(source='get_frequence_display', read_only=True)
    
    class Meta:
        model = AlerteRecherche
        fields = [
            'id', 'acheteur', 'acheteur_nom', 'nom_alerte',
            'secteur', 'region', 'prix_min', 'prix_max',
            'ca_min', 'ca_max', 'nombre_employes_min', 'nombre_employes_max',
            'type_transaction', 'active', 'frequence', 'frequence_display',
            'derniere_notification', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'acheteur', 'derniere_notification', 'created_at', 'updated_at']


class AlerteRechercheCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlerteRecherche
        fields = [
            'nom_alerte', 'secteur', 'region', 'prix_min', 'prix_max',
            'ca_min', 'ca_max', 'nombre_employes_min', 'nombre_employes_max',
            'type_transaction', 'frequence'
        ]
    
    def validate_nom_alerte(self, value):
        if not value or len(value) < 3:
            raise serializers.ValidationError("Le nom de l'alerte doit contenir au moins 3 caractères")
        return value
    
    def validate(self, data):
        # Au moins un critère doit être défini
        criteres = ['secteur', 'region', 'prix_min', 'prix_max', 'ca_min', 'ca_max', 
                    'nombre_employes_min', 'nombre_employes_max', 'type_transaction']
        
        if not any(data.get(c) for c in criteres):
            raise serializers.ValidationError(
                "Vous devez définir au moins un critère de recherche"
            )
        
        return data
