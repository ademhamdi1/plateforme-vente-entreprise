from django.db import models
from apps.users.models import User
from apps.entreprises.models import Entreprise


class Conversation(models.Model):
    """
    Modèle pour une conversation entre acheteur et vendeur
    """
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='conversations',
        verbose_name='Entreprise'
    )
    acheteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_acheteur',
        verbose_name='Acheteur'
    )
    vendeur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='conversations_vendeur',
        verbose_name='Vendeur'
    )
    sujet = models.CharField(max_length=200, verbose_name='Sujet')
    is_active = models.BooleanField(default=True, verbose_name='Active')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date de création')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Date de modification')
    
    class Meta:
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-updated_at']
        unique_together = ['entreprise', 'acheteur']
    
    def __str__(self):
        return f"{self.acheteur.username} - {self.entreprise.nom}"
    
    def get_last_message(self):
        return self.messages.last()


class Message(models.Model):
    """
    Modèle pour les messages dans une conversation
    """
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Conversation'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name='Expéditeur'
    )
    content = models.TextField(verbose_name='Contenu')
    attachment = models.FileField(
        upload_to='messages/',
        blank=True,
        null=True,
        verbose_name='Pièce jointe'
    )
    is_read = models.BooleanField(default=False, verbose_name='Lu')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'envoi')
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.sender.username} - {self.created_at}"


class ContactRequest(models.Model):
    """
    Modèle pour les demandes de contact
    """
    STATUT_CHOICES = (
        ('en_attente', 'En attente'),
        ('acceptee', 'Acceptée'),
        ('refusee', 'Refusée'),
    )
    
    entreprise = models.ForeignKey(
        Entreprise,
        on_delete=models.CASCADE,
        related_name='contact_requests',
        verbose_name='Entreprise'
    )
    acheteur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='contact_requests_sent',
        verbose_name='Acheteur'
    )
    nom = models.CharField(max_length=100, verbose_name='Nom complet')
    email = models.EmailField(verbose_name='Email')
    telephone = models.CharField(max_length=20, verbose_name='Téléphone')
    message = models.TextField(verbose_name='Message')
    statut = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente',
        verbose_name='Statut'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Date d\'envoi')
    
    class Meta:
        verbose_name = 'Demande de contact'
        verbose_name_plural = 'Demandes de contact'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.nom} - {self.entreprise.nom}"
