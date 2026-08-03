FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_SETTINGS_MODULE=config.settings

# Runtime libs for psycopg2-binary + Pillow, plus curl for healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq5 libjpeg62-turbo zlib1g curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/requirements.txt
# setuptools pinned: djangorestframework-simplejwt 5.3 imports pkg_resources,
# which is no longer shipped with Python 3.12.
RUN pip install --no-cache-dir -r requirements.txt "setuptools<81"

COPY . /app/

RUN chmod +x /app/entrypoint.sh && mkdir -p /app/staticfiles /app/media

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -fsS http://localhost:8000/api/ || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--threads", "2", \
     "--timeout", "120", \
     "--access-logfile", "-"]
