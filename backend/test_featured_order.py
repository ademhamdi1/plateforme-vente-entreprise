#!/usr/bin/env python
"""Test script to set one enterprise as featured and verify order"""
import os
import sys
import django
from datetime import timedelta

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from apps.entreprises.models import Entreprise

# Get first published enterprise
entreprise = Entreprise.objects.filter(statut='publiee').first()

if entreprise:
    # Set as featured for 30 days
    entreprise.est_mise_en_avant = True
    entreprise.date_debut_mise_en_avant = timezone.now()
    entreprise.date_fin_mise_en_avant = timezone.now() + timedelta(days=30)
    entreprise.save()
    
    print(f"✅ Entreprise '{entreprise.nom}' mise en avant jusqu'au {entreprise.date_fin_mise_en_avant}")
    print(f"   Slug: {entreprise.slug}")
    
    # Show order
    print("\n📋 Ordre des entreprises dans la liste:")
    all_entreprises = Entreprise.objects.filter(statut='publiee')
    for i, ent in enumerate(all_entreprises[:5], 1):
        star = "⭐" if ent.est_mise_en_avant else "  "
        print(f"{i}. {star} {ent.nom}")
else:
    print("❌ Aucune entreprise publiée trouvée")
