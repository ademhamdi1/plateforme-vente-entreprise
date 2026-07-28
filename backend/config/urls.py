"""
URL configuration for entreprises platform project.
"""
from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Entreprises Platform API",
        default_version='v1',
        description="API pour la plateforme de vente et d'achat d'entreprises en Tunisie",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@entreprises.tn"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

def backend_root(request):
    """Page d'accueil du backend avec interface visuelle"""
    return render(request, 'backend_home.html')

def api_root(request):
    """Vue racine de l'API avec la liste des endpoints disponibles"""
    return JsonResponse({
        'message': 'Bienvenue sur l\'API Entreprises Platform',
        'version': 'v1',
        'endpoints': {
            'documentation': {
                'swagger': request.build_absolute_uri('/swagger/'),
                'redoc': request.build_absolute_uri('/redoc/'),
            },
            'users': {
                'register': request.build_absolute_uri('/api/users/register/'),
                'login': request.build_absolute_uri('/api/users/login/'),
                'profile': request.build_absolute_uri('/api/users/profile/'),
            },
            'entreprises': {
                'list': request.build_absolute_uri('/api/entreprises/'),
                'featured': request.build_absolute_uri('/api/entreprises/featured/'),
                'search': request.build_absolute_uri('/api/entreprises/search/'),
            },

            'messaging': {
                'conversations': request.build_absolute_uri('/api/messaging/conversations/'),
                'messages': request.build_absolute_uri('/api/messaging/messages/'),
            },
            'subscriptions': {
                'plans': request.build_absolute_uri('/api/subscriptions/plans/'),
                'subscriptions': request.build_absolute_uri('/api/subscriptions/subscriptions/'),
            }
        }
    })


urlpatterns = [
    path('', backend_root, name='backend-root'),
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API root
    path('api/', api_root, name='api-root'),
    
    # API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/entreprises/', include('apps.entreprises.urls')),
    path('api/messaging/', include('apps.messaging.urls')),
    path('api/subscriptions/', include('apps.subscriptions.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "BusinessBuy Administration"
admin.site.site_title = "BusinessBuy Admin"
admin.site.index_title = "📊 Tableau de bord BusinessBuy"
admin.site.site_url = 'http://localhost:3000/'
