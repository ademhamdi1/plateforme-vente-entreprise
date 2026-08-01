from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.entreprises.models import Entreprise


class Command(BaseCommand):
    help = 'Publish all pending entreprises'

    def handle(self, *args, **options):
        # Get all entreprises in pending status
        pending = Entreprise.objects.filter(statut='en_attente')
        count = pending.count()
        
        if count == 0:
            self.stdout.write(
                self.style.WARNING('No pending entreprises found')
            )
            return
        
        # Update all to published
        pending.update(
            statut='publiee',
            published_at=timezone.now()
        )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully published {count} entreprise(s)'
            )
        )
