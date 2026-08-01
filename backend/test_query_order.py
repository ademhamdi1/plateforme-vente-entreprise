#!/usr/bin/env python
"""Test the ordering query"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from django.db.models import Case, When, BooleanField, Q
from apps.entreprises.models import Entreprise

now = timezone.now()

# Same query as in EntrepriseListView
queryset = Entreprise.objects.filter(statut='publiee').annotate(
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

print("📋 Ordre avec la nouvelle requête:")
for i, ent in enumerate(queryset[:10], 1):
    star = "⭐" if ent.is_currently_featured else "  "
    date = ent.published_at.strftime('%Y-%m-%d') if ent.published_at else 'N/A'
    print(f"{i}. {star} {ent.nom} | Publié: {date} | En avant: {ent.est_mise_en_avant}")
