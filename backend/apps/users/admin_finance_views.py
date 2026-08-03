from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from .abonnement_models import Abonnement, HistoriquePaiement
from .abonnement_serializers import AbonnementSerializer, HistoriquePaiementSerializer


class IsAdminPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_staff or request.user.user_type == 'admin'
        )


class AdminFinanceDashboardView(APIView):
    """Tableau de bord financier - admin uniquement"""
    permission_classes = [IsAdminPermission]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        # Revenue total (paiements réussis)
        total_revenue = HistoriquePaiement.objects.filter(
            statut='reussi'
        ).aggregate(total=Sum('montant'))['total'] or 0

        # Revenue ce mois
        monthly_revenue = HistoriquePaiement.objects.filter(
            statut='reussi',
            created_at__gte=thirty_days_ago
        ).aggregate(total=Sum('montant'))['total'] or 0

        # Revenue par plan
        revenue_by_plan = HistoriquePaiement.objects.filter(
            statut='reussi'
        ).values('plan').annotate(
            total=Sum('montant'),
            count=Count('id')
        ).order_by('-total')

        # Abonnements actifs par plan
        active_subs_by_plan = Abonnement.objects.filter(
            statut='actif'
        ).values('plan').annotate(count=Count('id'))

        # Abonnements par statut
        subs_by_status = Abonnement.objects.values('statut').annotate(count=Count('id'))

        # Paiements récents
        recent_payments = HistoriquePaiement.objects.filter(
            statut='reussi'
        ).order_by('-created_at')[:10]

        # Statistiques générales
        total_users = __import__('apps.users.models', fromlist=['User']).User.objects.count()
        total_vendeurs = __import__('apps.users.models', fromlist=['User']).User.objects.filter(user_type='vendeur').count()
        total_acheteurs = __import__('apps.users.models', fromlist=['User']).User.objects.filter(user_type='acheteur').count()

        return Response({
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue,
            'revenue_by_plan': list(revenue_by_plan),
            'active_subs_by_plan': list(active_subs_by_plan),
            'subs_by_status': list(subs_by_status),
            'recent_payments': HistoriquePaiementSerializer(recent_payments, many=True).data,
            'total_users': total_users,
            'total_vendeurs': total_vendeurs,
            'total_acheteurs': total_acheteurs,
        })


class AdminPaymentListView(generics.ListAPIView):
    """Liste de tous les paiements - admin uniquement"""
    serializer_class = HistoriquePaiementSerializer
    permission_classes = [IsAdminPermission]

    def get_queryset(self):
        queryset = HistoriquePaiement.objects.all()
        statut = self.request.query_params.get('statut')
        plan = self.request.query_params.get('plan')

        if statut:
            queryset = queryset.filter(statut=statut)
        if plan:
            queryset = queryset.filter(plan=plan)
        return queryset


class AdminAbonnementListView(generics.ListAPIView):
    """Liste de tous les abonnements - admin uniquement"""
    serializer_class = AbonnementSerializer
    permission_classes = [IsAdminPermission]

    def get_queryset(self):
        queryset = Abonnement.objects.all()
        plan = self.request.query_params.get('plan')
        statut = self.request.query_params.get('statut')

        if plan:
            queryset = queryset.filter(plan=plan)
        if statut:
            queryset = queryset.filter(statut=statut)
        return queryset
