from django.apps import AppConfig


class EntreprisesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.entreprises'
    verbose_name = 'Entreprises'
    
    def ready(self):
        import apps.entreprises.signals  # Importer les signals
