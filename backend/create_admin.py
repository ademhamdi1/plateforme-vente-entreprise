import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User

# Create admin user
admin, created = User.objects.get_or_create(
    email='admin@test.com',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'System',
        'user_type': 'admin',
        'phone': '20000000',
    }
)

if created:
    admin.set_password('admin1234')
    admin.save()
    print('✅ Admin créé: admin@test.com / admin1234')
else:
    print('✅ Admin existant: admin@test.com')
