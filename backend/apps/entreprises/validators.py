"""
Validateurs pour les fichiers uploadés
"""
import os
from django.core.exceptions import ValidationError
from django.conf import settings


def validate_image_file(file):
    """Valider les images uploadées"""
    # Vérifier l'extension
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in settings.ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(
            f'Type de fichier non autorisé. Extensions autorisées: {", ".join(settings.ALLOWED_IMAGE_EXTENSIONS)}'
        )
    
    # Vérifier la taille
    if file.size > settings.MAX_IMAGE_SIZE:
        max_size_mb = settings.MAX_IMAGE_SIZE / (1024 * 1024)
        raise ValidationError(
            f'Fichier trop volumineux. Taille maximale: {max_size_mb} MB'
        )


def validate_document_file(file):
    """Valider les documents uploadés"""
    # Vérifier l'extension
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in settings.ALLOWED_DOCUMENT_EXTENSIONS:
        raise ValidationError(
            f'Type de fichier non autorisé. Extensions autorisées: {", ".join(settings.ALLOWED_DOCUMENT_EXTENSIONS)}'
        )
    
    # Vérifier la taille
    if file.size > settings.MAX_DOCUMENT_SIZE:
        max_size_mb = settings.MAX_DOCUMENT_SIZE / (1024 * 1024)
        raise ValidationError(
            f'Fichier trop volumineux. Taille maximale: {max_size_mb} MB'
        )


def validate_video_file(file):
    """Valider les vidéos uploadées"""
    # Vérifier l'extension
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in settings.ALLOWED_VIDEO_EXTENSIONS:
        raise ValidationError(
            f'Type de fichier non autorisé. Extensions autorisées: {", ".join(settings.ALLOWED_VIDEO_EXTENSIONS)}'
        )
    
    # Vérifier la taille
    if file.size > settings.MAX_VIDEO_SIZE:
        max_size_mb = settings.MAX_VIDEO_SIZE / (1024 * 1024)
        raise ValidationError(
            f'Fichier trop volumineux. Taille maximale: {max_size_mb} MB'
        )
