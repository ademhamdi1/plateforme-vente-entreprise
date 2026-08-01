from django.db import models
from django.utils.text import slugify
from apps.users.models import User


class Actualite(models.Model):
    """
    Modèle pour les actualités/news de la plateforme
    """
    titre = models.CharField(max_length=200, verbose_name='Titre')
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    contenu = models.TextField(verbose_name='Contenu')
    image = models.ImageField(
        upload_to='actualites/',
        blank=True,
        null=True,
        verbose_name='Image'
    )
    auteur = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='actualites',
        verbose_name='Auteur'
    )
    est_publiee = models.BooleanField(default=False, verbose_name='Publiée')
    date_publication = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Date de publication'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Actualité'
        verbose_name_plural = 'Actualités'
        ordering = ['-date_publication', '-created_at']
    
    def __str__(self):
        return self.titre
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.titre)
            counter = 1
            while Actualite.objects.filter(slug=self.slug).exists():
                self.slug = f"{slugify(self.titre)}-{counter}"
                counter += 1
        super().save(*args, **kwargs)
