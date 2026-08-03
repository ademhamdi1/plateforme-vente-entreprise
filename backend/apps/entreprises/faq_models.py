from django.db import models


class FAQ(models.Model):
    """Foire Aux Questions - manageable from admin and API"""
    CATEGORIE_CHOICES = [
        ('General', 'General'),
        ('Vendeurs', 'Pour les Vendeurs'),
        ('Acheteurs', 'Pour les Acheteurs'),
        ('Abonnements', 'Abonnements'),
        ('Securite', 'Securite & Confidentialite'),
    ]

    question = models.CharField(max_length=300, verbose_name='Question')
    reponse = models.TextField(verbose_name='Reponse')
    categorie = models.CharField(
        max_length=50,
        choices=CATEGORIE_CHOICES,
        default='General',
        verbose_name='Categorie'
    )
    ordre = models.IntegerField(default=0, verbose_name='Ordre d\'affichage')
    est_publie = models.BooleanField(default=True, verbose_name='Publie')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['categorie', 'ordre', 'created_at']
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'

    def __str__(self):
        return self.question
