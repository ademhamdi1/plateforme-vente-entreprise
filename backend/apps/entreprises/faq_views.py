from rest_framework import generics, permissions
from .faq_models import FAQ
from .faq_serializers import FAQSerializer


class FAQPublicView(generics.ListAPIView):
    """Liste des FAQ publiées - accès public"""
    serializer_class = FAQSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return FAQ.objects.filter(est_publie=True)


class FAQAdminView(generics.ListCreateAPIView):
    """Liste + Création FAQ - admin uniquement"""
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return FAQ.objects.all()


class FAQAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détail + Modification + Suppression FAQ - admin uniquement"""
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = FAQ.objects.all()
