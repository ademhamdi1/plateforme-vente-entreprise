#!/bin/sh
set -e

echo "==> Collecting static files"
python manage.py collectstatic --noinput

echo "==> Running database migrations"
python manage.py migrate --noinput || echo "    WARNING: some migrations failed, continuing..."

# Idempotent superuser creation for the demo
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    echo "==> Ensuring superuser '$DJANGO_SUPERUSER_USERNAME' exists"
    python manage.py createsuperuser --noinput 2>/dev/null || echo "    (superuser already exists or skipped)"
fi

echo "==> Starting: $@"
exec "$@"
