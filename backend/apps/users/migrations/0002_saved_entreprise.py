from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('entreprises', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedEntreprise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date de sauvegarde')),
                ('entreprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_by', to='entreprises.entreprise', verbose_name='Entreprise')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='saved_entreprises', to=settings.AUTH_USER_MODEL, verbose_name='Utilisateur')),
            ],
            options={
                'verbose_name': 'Entreprise sauvegardée',
                'verbose_name_plural': 'Entreprises sauvegardées',
                'ordering': ['-created_at'],
                'unique_together': {('user', 'entreprise')},
            },
        ),
    ]