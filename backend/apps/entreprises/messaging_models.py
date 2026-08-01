from django.db import models
from django.conf import settings
from .models import Entreprise


class Conversation(models.Model):
    """Conversation entre un acheteur et un vendeur à propos d'une entreprise"""
    entreprise = models.ForeignKey(Entreprise, on_delete=models.CASCADE, related_name='conversations')
    acheteur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations_as_buyer')
    vendeur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='conversations_as_seller')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived_by_acheteur = models.BooleanField(default=False)
    is_archived_by_vendeur = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-updated_at']
        unique_together = ['entreprise', 'acheteur', 'vendeur']
    
    def __str__(self):
        return f"Conversation: {self.acheteur.username} → {self.vendeur.username} ({self.entreprise.nom})"


class Message(models.Model):
    """Message dans une conversation"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    attachment = models.FileField(
        upload_to='messages/attachments/',
        blank=True,
        null=True,
        verbose_name='Pièce jointe'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message de {self.sender.username} à {self.created_at}"
