from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('entreprises', '0009_faq'),
    ]

    operations = [
        # The production DB has a stale `adresse` column (NOT NULL) from the original
        # migration that was replaced. The current model defines it as nullable, but
        # Django's migration state doesn't know about the column, so we use raw SQL.
        migrations.RunSQL(
            sql=[
                "ALTER TABLE entreprises_entreprise ALTER COLUMN adresse DROP NOT NULL;",
            ],
            reverse_sql=[
                "ALTER TABLE entreprises_entreprise ALTER COLUMN adresse SET NOT NULL;",
            ],
        ),
    ]
