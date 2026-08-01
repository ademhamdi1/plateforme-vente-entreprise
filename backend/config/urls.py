"""
URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render


def api_root(request):
    """Page d'accueil de l'API"""
    return render(request, 'api_home.html')


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/users/', include('apps.users.urls')),
    path('api/entreprises/', include('apps.entreprises.urls')),
]

# Media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin customization
admin.site.site_header = "Plateforme Vente Entreprises TN"
admin.site.site_title = "Admin"
admin.site.index_title = "Tableau de bord"
