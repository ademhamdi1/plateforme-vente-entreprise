from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.utils import timezone
from datetime import timedelta
from .models import Plan, Subscription, Payment
from .serializers import PlanSerializer, SubscriptionSerializer, PaymentSerializer


class PlanListView(generics.ListAPIView):
    """
    Liste des plans d'abonnement disponibles
    """
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]


class SubscriptionCreateView(generics.CreateAPIView):
    """
    Créer un nouvel abonnement
    """
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        plan = serializer.validated_data['plan']
        start_date = timezone.now()
        end_date = start_date + timedelta(days=plan.duration_days)
        
        serializer.save(
            user=self.request.user,
            start_date=start_date,
            end_date=end_date
        )


class MySubscriptionView(generics.RetrieveAPIView):
    """
    Récupérer l'abonnement actif de l'utilisateur
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return Subscription.objects.filter(
            user=self.request.user,
            statut='active'
        ).first()


class SubscriptionListView(generics.ListAPIView):
    """
    Liste des abonnements de l'utilisateur
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)


class PaymentListView(generics.ListAPIView):
    """
    Liste des paiements de l'utilisateur
    """
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(subscription__user=self.request.user)
