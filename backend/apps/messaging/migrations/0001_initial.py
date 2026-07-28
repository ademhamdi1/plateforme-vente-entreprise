from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('entreprises', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sujet', models.CharField(max_length=200, verbose_name='Sujet')),
                ('is_active', models.BooleanField(default=True, verbose_name='Active')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Date de création')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Date de modification')),
                ('acheteur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversations_acheteur', to=settings.AUTH_USER_MODEL, verbose_name='Acheteur')),
                ('entreprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversations', to='entreprises.entreprise', verbose_name='Entreprise')),
                ('vendeur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='conversations_vendeur', to=settings.AUTH_USER_MODEL, verbose_name='Vendeur')),
            ],
            options={
                'verbose_name': 'Conversation',
                'verbose_name_plural': 'Conversations',
                'ordering': ['-updated_at'],
                'unique_together': {('entreprise', 'acheteur')},
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='Contenu')),
                ('attachment', models.FileField(blank=True, null=True, upload_to='messages/', verbose_name='Pièce jointe')),
                ('is_read', models.BooleanField(default=False, verbose_name='Lu')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")),
                ('conversation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='messaging.conversation', verbose_name='Conversation')),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sent_messages', to=settings.AUTH_USER_MODEL, verbose_name='Expéditeur')),
            ],
            options={
                'verbose_name': 'Message',
                'verbose_name_plural': 'Messages',
                'ordering': ['created_at'],
            },
        ),
        migrations.CreateModel(
            name='ContactRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=100, verbose_name='Nom complet')),
                ('email', models.EmailField(max_length=254, verbose_name='Email')),
                ('telephone', models.CharField(max_length=20, verbose_name='Téléphone')),
                ('message', models.TextField(verbose_name='Message')),
                ('statut', models.CharField(choices=[('en_attente', 'En attente'), ('acceptee', 'Acceptée'), ('refusee', 'Refusée')], default='en_attente', max_length=20, verbose_name='Statut')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name="Date d'envoi")),
                ('acheteur', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact_requests_sent', to=settings.AUTH_USER_MODEL, verbose_name='Acheteur')),
                ('entreprise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contact_requests', to='entreprises.entreprise', verbose_name='Entreprise')),
            ],
            options={
                'verbose_name': 'Demande de contact',
                'verbose_name_plural': 'Demandes de contact',
                'ordering': ['-created_at'],
            },
        ),
    ]