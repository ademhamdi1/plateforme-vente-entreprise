from django.urls import path
from .views import (
    EntrepriseListView,
    EntrepriseDetailView,
    EntrepriseCreateView,
    EntrepriseUpdateView,
    EntrepriseDeleteView,
    MesEntreprisesView,
    EntrepriseImageUploadView,
    EntrepriseDocumentUploadView
)

app_name = 'entreprises'

urlpatterns = [
    path('', EntrepriseListView.as_view(), name='entreprise-list'),
    path('mes-entreprises/', MesEntreprisesView.as_view(), name='mes-entreprises'),
    path('create/', EntrepriseCreateView.as_view(), name='entreprise-create'),
    path('<slug:slug>/', EntrepriseDetailView.as_view(), name='entreprise-detail'),
    path('<slug:slug>/update/', EntrepriseUpdateView.as_view(), name='entreprise-update'),
    path('<slug:slug>/delete/', EntrepriseDeleteView.as_view(), name='entreprise-delete'),
    path('images/upload/', EntrepriseImageUploadView.as_view(), name='image-upload'),
    path('documents/upload/', EntrepriseDocumentUploadView.as_view(), name='document-upload'),
]
