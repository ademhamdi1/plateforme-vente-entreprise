from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Entreprise, EntrepriseImage, EntrepriseDocument
from .media_serializers import EntrepriseImageSerializer, EntrepriseDocumentSerializer


class IsEntrepriseOwner(permissions.BasePermission):
    """Permission: seul le propriétaire de l'entreprise peut uploader des médias"""
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        slug = view.kwargs.get('slug')
        entreprise = get_object_or_404(Entreprise, slug=slug)
        return entreprise.vendeur == request.user


class EntrepriseImagesListView(generics.ListAPIView):
    """Liste des images d'une entreprise - depuis PostgreSQL"""
    serializer_class = EntrepriseImageSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        slug = self.kwargs.get('slug')
        entreprise = get_object_or_404(Entreprise, slug=slug)
        return EntrepriseImage.objects.filter(entreprise=entreprise).order_by('order', 'uploaded_at')


class EntrepriseImageUploadView(APIView):
    """Upload d'une image pour une entreprise - sauvegardée dans PostgreSQL + /media/"""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsEntrepriseOwner]
    
    def post(self, request, slug):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        # Vérifier que l'utilisateur est vendeur
        if request.user.user_type != 'vendeur':
            return Response(
                {'error': 'Seuls les vendeurs peuvent uploader des images'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier qu'il y a une image
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Aucune image fournie'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier le nombre d'images (max 10)
        current_count = EntrepriseImage.objects.filter(entreprise=entreprise).count()
        if current_count >= 10:
            return Response(
                {'error': 'Nombre maximum d\'images atteint (10)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'image dans PostgreSQL
        image = EntrepriseImage.objects.create(
            entreprise=entreprise,
            image=request.FILES['image'],
            caption=request.data.get('legende', ''),
            order=request.data.get('ordre', current_count)
        )
        
        serializer = EntrepriseImageSerializer(image, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EntrepriseImageDeleteView(APIView):
    """Supprimer une image - supprimée de PostgreSQL + /media/"""
    permission_classes = [permissions.IsAuthenticated, IsEntrepriseOwner]
    
    def delete(self, request, slug, image_id):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        image = get_object_or_404(EntrepriseImage, id=image_id, entreprise=entreprise)
        
        # Supprimer le fichier et la DB entry
        image.delete()
        
        return Response(
            {'message': 'Image supprimée'},
            status=status.HTTP_200_OK
        )


class EntrepriseDocumentsListView(generics.ListAPIView):
    """Liste des documents d'une entreprise - depuis PostgreSQL"""
    serializer_class = EntrepriseDocumentSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        slug = self.kwargs.get('slug')
        entreprise = get_object_or_404(Entreprise, slug=slug)
        return EntrepriseDocument.objects.filter(entreprise=entreprise).order_by('-uploaded_at')


class EntrepriseDocumentUploadView(APIView):
    """Upload d'un document PDF pour une entreprise - sauvegardé dans PostgreSQL + /media/"""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.IsAuthenticated, IsEntrepriseOwner]
    
    def post(self, request, slug):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        
        # Vérifier que l'utilisateur est vendeur
        if request.user.user_type != 'vendeur':
            return Response(
                {'error': 'Seuls les vendeurs peuvent uploader des documents'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Vérifier qu'il y a un document
        if 'document' not in request.FILES:
            return Response(
                {'error': 'Aucun document fourni'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier le type de fichier (PDF uniquement)
        file = request.FILES['document']
        if not file.name.endswith('.pdf'):
            return Response(
                {'error': 'Seuls les fichiers PDF sont acceptés'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier la taille (max 10 MB)
        if file.size > 10 * 1024 * 1024:
            return Response(
                {'error': 'La taille du fichier ne doit pas dépasser 10 MB'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier le nombre de documents (max 5)
        current_count = EntrepriseDocument.objects.filter(entreprise=entreprise).count()
        if current_count >= 5:
            return Response(
                {'error': 'Nombre maximum de documents atteint (5)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer le document dans PostgreSQL
        document = EntrepriseDocument.objects.create(
            entreprise=entreprise,
            document=file,
            titre=request.data.get('nom', file.name),
            description=request.data.get('description', '')
        )
        
        serializer = EntrepriseDocumentSerializer(document, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EntrepriseDocumentDeleteView(APIView):
    """Supprimer un document - supprimé de PostgreSQL + /media/"""
    permission_classes = [permissions.IsAuthenticated, IsEntrepriseOwner]
    
    def delete(self, request, slug, document_id):
        entreprise = get_object_or_404(Entreprise, slug=slug)
        document = get_object_or_404(EntrepriseDocument, id=document_id, entreprise=entreprise)
        
        # Supprimer le fichier et la DB entry
        document.delete()
        
        return Response(
            {'message': 'Document supprimé'},
            status=status.HTTP_200_OK
        )
