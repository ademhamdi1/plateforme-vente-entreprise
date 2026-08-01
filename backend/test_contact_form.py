"""
Test script pour vérifier le formulaire de contact
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import ContactMessage

def test_contact_messages():
    print("=" * 60)
    print("TEST: Système de Contact")
    print("=" * 60)
    
    # Compter les messages
    total_messages = ContactMessage.objects.count()
    print(f"\n✓ Total messages de contact: {total_messages}")
    
    # Compter par statut
    print("\n📊 Messages par statut:")
    for statut, label in ContactMessage.STATUT_CHOICES:
        count = ContactMessage.objects.filter(statut=statut).count()
        print(f"  - {label}: {count}")
    
    # Compter par sujet
    print("\n📧 Messages par sujet:")
    for sujet, label in ContactMessage.SUJET_CHOICES:
        count = ContactMessage.objects.filter(sujet=sujet).count()
        if count > 0:
            print(f"  - {label}: {count}")
    
    # Afficher les derniers messages
    print("\n📨 Derniers messages de contact:")
    recent_messages = ContactMessage.objects.all()[:5]
    if recent_messages:
        for msg in recent_messages:
            print(f"\n  ID: {msg.id}")
            print(f"  De: {msg.nom} ({msg.email})")
            print(f"  Sujet: {msg.get_sujet_display() if msg.sujet else 'Sans sujet'}")
            print(f"  Statut: {msg.get_statut_display()}")
            print(f"  Message: {msg.message[:100]}{'...' if len(msg.message) > 100 else ''}")
            print(f"  Date: {msg.created_at.strftime('%d/%m/%Y %H:%M')}")
            if msg.utilisateur:
                print(f"  Utilisateur lié: {msg.utilisateur.username}")
    else:
        print("  Aucun message pour le moment")
    
    print("\n" + "=" * 60)
    print("✅ Test terminé!")
    print("=" * 60)

if __name__ == '__main__':
    test_contact_messages()
