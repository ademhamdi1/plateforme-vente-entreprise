from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entreprises', '0009_faq'),
    ]

    operations = [
        # Make adresse nullable (was NOT NULL from original schema, but model now has null=True)
        migrations.AlterField(
            model_name='entreprise',
            name='adresse',
            field=models.CharField(blank=True, max_length=300, null=True, verbose_name='Adresse'),
        ),
    ]
