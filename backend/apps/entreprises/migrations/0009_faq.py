from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entreprises', '0008_message_attachment'),
    ]

    operations = [
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=300, verbose_name='Question')),
                ('reponse', models.TextField(verbose_name='Reponse')),
                ('categorie', models.CharField(
                    choices=[
                        ('General', 'General'),
                        ('Vendeurs', 'Pour les Vendeurs'),
                        ('Acheteurs', 'Pour les Acheteurs'),
                        ('Abonnements', 'Abonnements'),
                        ('Securite', 'Securite & Confidentialite'),
                    ],
                    default='General', max_length=50, verbose_name='Categorie'
                )),
                ('ordre', models.IntegerField(default=0, verbose_name="Ordre d'affichage")),
                ('est_publie', models.BooleanField(default=True, verbose_name='Publie')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'FAQ',
                'verbose_name_plural': 'FAQs',
                'ordering': ['categorie', 'ordre', 'created_at'],
            },
        ),
    ]
