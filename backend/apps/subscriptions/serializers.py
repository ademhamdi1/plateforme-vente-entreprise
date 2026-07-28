from rest_framework import serializers
from .models import Plan, Subscription, Payment


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'slug', 'description', 'price',
            'duration_days', 'max_annonces', 'mise_en_avant',
            'statistiques_avancees', 'support_prioritaire',
            'badge_verifie', 'publicite_premium',
            'accompagnement_personnalise'
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan_details = PlanSerializer(source='plan', read_only=True)
    is_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'plan', 'plan_details', 'statut',
            'start_date', 'end_date', 'auto_renew',
            'is_active', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            'id', 'subscription', 'amount', 'statut',
            'payment_method', 'transaction_id',
            'paid_at', 'created_at'
        ]
        read_only_fields = ['created_at']
