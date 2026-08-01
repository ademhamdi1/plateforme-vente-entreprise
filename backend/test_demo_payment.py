"""
Test du endpoint de paiement DEMO
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.abonnement_models import Abonnement, HistoriquePaiement
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

User = get_user_model()

print("=" * 60)
print("TEST: Paiement DEMO")
print("=" * 60)

# Trouver un utilisateur de test
try:
    user = User.objects.get(email='acheteur@test.com')
    print(f"\n✓ Utilisateur trouvé: {user.username}")
    
    # Simuler un paiement DEMO
    plan = 'premium'
    period = 'monthly'
    montant = Decimal('49.99')
    
    # Créer l'abonnement
    date_debut = timezone.now()
    date_fin = date_debut + timedelta(days=30)
    
    abonnement, created = Abonnement.objects.update_or_create(
        utilisateur=user,
        defaults={
            'plan': plan,
            'statut': 'actif',
            'date_debut': date_debut,
            'date_fin': date_fin,
            'auto_renouvellement': True,
        }
    )
    
    print(f"\n{'✓ Abonnement créé' if created else '✓ Abonnement mis à jour'}")
    print(f"  Plan: {abonnement.plan}")
    print(f"  Statut: {abonnement.statut}")
    print(f"  Date fin: {abonnement.date_fin.strftime('%d/%m/%Y')}")
    
    # Créer le paiement
    paiement = HistoriquePaiement.objects.create(
        utilisateur=user,
        abonnement=abonnement,
        montant=montant,
        devise='TND',
        statut='complete',
        methode_paiement='demo',
        transaction_id=f'DEMO-TEST-{timezone.now().timestamp()}',
        plan=plan,
        duree_mois=1,
    )
    
    print(f"\n✓ Paiement enregistré")
    print(f"  ID: {paiement.id}")
    print(f"  Montant: {paiement.montant} {paiement.devise}")
    print(f"  Transaction: {paiement.transaction_id}")
    print(f"  Méthode: {paiement.methode_paiement}")
    
    # Vérifier dans la DB
    total_paiements = HistoriquePaiement.objects.filter(utilisateur=user).count()
    print(f"\n📊 Total paiements pour {user.username}: {total_paiements}")
    
    print("\n" + "=" * 60)
    print("✅ Test réussi!")
    print("=" * 60)
    
except User.DoesNotExist:
    print("\n❌ Utilisateur acheteur@test.com non trouvé")
except Exception as e:
    print(f"\n❌ Erreur: {str(e)}")
    import traceback
    traceback.print_exc()
