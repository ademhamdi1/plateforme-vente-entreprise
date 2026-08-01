from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Entreprise
from .serializers import EntrepriseSerializer, EntrepriseCreateSerializer


class IsVendeur(permissions.BasePermission):
    """Permission pour les vendeurs uniquement"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'vendeur'


class EntrepriseListView(generics.ListAPIView):
    """Liste des entreprises publiées - Mises en avant en premier"""
    serializer_class = EntrepriseSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        from django.utils import timezone
        from django.db.models import Case, When, BooleanField, Q
        
        now = timezone.now()
        
        # Annoter si l'entreprise est actuellement mise en avant (active)
        return Entreprise.objects.filter(statut='publiee').annotate(
            is_currently_featured=Case(
                When(
                    Q(est_mise_en_avant=True) &
                    Q(date_debut_mise_en_avant__lte=now) &
                    Q(date_fin_mise_en_avant__gte=now),
                    then=True
                ),
                default=False,
                output_field=BooleanField()
            )
        ).order_by('-is_currently_featured', '-published_at')


class EntrepriseDetailView(generics.RetrieveAPIView):
    """Détail d'une entreprise par slug - Incrémente le nombre de vues"""
    serializer_class = EntrepriseSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Publiques pour tous, ou propres entreprises pour vendeur
        if self.request.user.is_authenticated and self.request.user.user_type == 'vendeur':
            return Entreprise.objects.filter(vendeur=self.request.user) | Entreprise.objects.filter(statut='publiee')
        return Entreprise.objects.filter(statut='publiee')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter le nombre de vues (sauf si c'est le vendeur qui regarde)
        if not (request.user.is_authenticated and instance.vendeur == request.user):
            instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class EntrepriseCreateView(generics.CreateAPIView):
    """Créer une entreprise (vendeur uniquement)"""
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseCreateSerializer
    permission_classes = [IsVendeur]


class EntrepriseUpdateView(generics.UpdateAPIView):
    """Modifier une entreprise (vendeur uniquement - ses propres entreprises)"""
    serializer_class = EntrepriseCreateSerializer
    permission_classes = [IsVendeur]
    lookup_field = 'slug'
    
    def get_queryset(self):
        # Vendeur ne peut modifier que ses propres entreprises
        return Entreprise.objects.filter(vendeur=self.request.user)


class MesEntreprisesView(generics.ListAPIView):
    """Liste des entreprises du vendeur connecté"""
    serializer_class = EntrepriseSerializer
    permission_classes = [IsVendeur]
    
    def get_queryset(self):
        return Entreprise.objects.filter(vendeur=self.request.user)



class EntreprisesMisesEnAvantView(generics.ListAPIView):
    """Liste des entreprises mises en avant actives - depuis PostgreSQL"""
    serializer_class = EntrepriseSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        from django.utils import timezone
        now = timezone.now()
        
        # Entreprises publiées + mise en avant active (entre date début et fin)
        return Entreprise.objects.filter(
            statut='publiee',
            est_mise_en_avant=True,
            date_debut_mise_en_avant__lte=now,
            date_fin_mise_en_avant__gte=now
        ).order_by('-date_debut_mise_en_avant')[:6]  # Max 6 entreprises vedettes
