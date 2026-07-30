from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Entreprise, EntrepriseImage, EntrepriseDocument
from .serializers import (
    EntrepriseListSerializer,
    EntrepriseDetailSerializer,
    EntrepriseCreateUpdateSerializer,
    EntrepriseImageSerializer,
    EntrepriseDocumentSerializer
)
from .filters import EntrepriseFilter
from .permissions import IsVendeurOrReadOnly, IsVendeur


class EntrepriseListView(generics.ListAPIView):
    """
    Liste des entreprises publiées avec recherche et filtres
    """
    serializer_class = EntrepriseListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = EntrepriseFilter
    search_fields = ['nom', 'description', 'ville']
    ordering_fields = ['prix_demande', 'chiffre_affaires', 'nombre_vues', 'created_at']
    ordering = ['-est_mise_en_avant', '-created_at']
    
    def get_queryset(self):
        queryset = Entreprise.objects.select_related('vendeur')
        user = self.request.user

        if user.is_authenticated and user.user_type == 'vendeur':
            return queryset.filter(Q(statut='publiee') | Q(vendeur=user)).distinct()

        return queryset.filter(statut='publiee')


class EntrepriseDetailView(generics.RetrieveAPIView):
    """
    Détails d'une entreprise
    """
    serializer_class = EntrepriseDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = Entreprise.objects.select_related('vendeur')
        user = self.request.user

        if user.is_authenticated and user.user_type == 'vendeur':
            return queryset.filter(Q(statut='publiee') | Q(vendeur=user)).distinct()

        return queryset.filter(statut='publiee')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.increment_views()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class EntrepriseCreateView(generics.CreateAPIView):
    """
    Créer une nouvelle entreprise
    """
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseCreateUpdateSerializer
    permission_classes = [IsVendeur]


class EntrepriseUpdateView(generics.UpdateAPIView):
    """
    Modifier une entreprise
    """
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsVendeurOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Entreprise.objects.filter(vendeur=self.request.user)


class EntrepriseDeleteView(generics.DestroyAPIView):
    """
    Supprimer une entreprise
    """
    queryset = Entreprise.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsVendeurOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Entreprise.objects.filter(vendeur=self.request.user)


class MesEntreprisesView(generics.ListAPIView):
    """
    Liste des entreprises du vendeur connecté
    """
    serializer_class = EntrepriseListSerializer
    permission_classes = [permissions.IsAuthenticated, IsVendeur]
    
    def get_queryset(self):
        return Entreprise.objects.filter(vendeur=self.request.user)


class EntrepriseImageUploadView(generics.CreateAPIView):
    """
    Uploader une image pour une entreprise
    """
    queryset = EntrepriseImage.objects.all()
    serializer_class = EntrepriseImageSerializer
    permission_classes = [permissions.IsAuthenticated]


class EntrepriseDocumentUploadView(generics.CreateAPIView):
    """
    Uploader un document pour une entreprise
    """
    queryset = EntrepriseDocument.objects.all()
    serializer_class = EntrepriseDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
