from rest_framework import serializers
from .faq_models import FAQ


class FAQSerializer(serializers.ModelSerializer):
    categorie_label = serializers.CharField(source='get_categorie_display', read_only=True)

    class Meta:
        model = FAQ
        fields = ['id', 'question', 'reponse', 'categorie', 'categorie_label',
                  'ordre', 'est_publie', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
