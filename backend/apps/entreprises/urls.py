from django.urls import path
from .views import (
    EntrepriseListView,
    EntrepriseDetailView,
    EntrepriseCreateView,
    EntrepriseUpdateView,
    MesEntreprisesView,
    EntreprisesMisesEnAvantView,
    SecteursCountView,
)
from .admin_views import (
    AdminEntreprisesEnAttenteView,
    AdminEntreprisesPublieesView,
    AdminValiderEntrepriseView,
    AdminRefuserEntrepriseView,
    AdminStatistiquesView,
    AdminMettreEnAvantView,
    AdminRetirerMiseEnAvantView,
)
from .messaging_views import (
    ConversationListView,
    ConversationDetailView,
    ConversationCreateView,
    MessageCreateView,
    ConversationArchiveView,
    UnreadMessagesCountView,
)
from .favoris_views import (
    FavorisListView,
    FavoriAddView,
    FavoriRemoveView,
    FavoriStatusView,
    FavorisCountView,
)
from .media_views import (
    EntrepriseImagesListView,
    EntrepriseImageUploadView,
    EntrepriseImageDeleteView,
    EntrepriseDocumentsListView,
    EntrepriseDocumentUploadView,
    EntrepriseDocumentDeleteView,
)
from .statistiques_views import (
    StatistiquesEntrepriseView,
    StatistiquesDashboardVendeurView,
    EnregistrerActionView,
)
from .actualite_views import ActualiteViewSet
from .recommandations_views import (
    RecommandationsAcheteurView,
    EntreprisesSimilairesView,
)
from .faq_views import FAQPublicView, FAQAdminView, FAQAdminDetailView

urlpatterns = [
    # FAQ routes - depuis PostgreSQL
    path('faq/', FAQPublicView.as_view(), name='faq-public'),
    path('admin/faq/', FAQAdminView.as_view(), name='faq-admin-list'),
    path('admin/faq/<int:pk>/', FAQAdminDetailView.as_view(), name='faq-admin-detail'),

    # Secteurs count - depuis PostgreSQL
    path('secteurs/', SecteursCountView.as_view(), name='secteurs-count'),

    # Actualités routes - Données depuis PostgreSQL
    path('actualites/', ActualiteViewSet.as_view({'get': 'list', 'post': 'create'}), name='actualite-list'),
    path('actualites/recentes/', ActualiteViewSet.as_view({'get': 'recentes'}), name='actualites-recentes'),
    path('actualites/<slug:slug>/', ActualiteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='actualite-detail'),
    
    # Recommandations routes - Données depuis PostgreSQL
    path('recommandations/', RecommandationsAcheteurView.as_view(), name='recommandations-acheteur'),
    path('<slug:slug>/similaires/', EntreprisesSimilairesView.as_view(), name='entreprises-similaires'),
    
    path('', EntrepriseListView.as_view(), name='entreprise-list'),
    path('mises-en-avant/', EntreprisesMisesEnAvantView.as_view(), name='entreprises-mises-en-avant'),
    path('create/', EntrepriseCreateView.as_view(), name='entreprise-create'),
    path('mes-entreprises/', MesEntreprisesView.as_view(), name='mes-entreprises'),
    
    # Admin routes
    path('admin/en-attente/', AdminEntreprisesEnAttenteView.as_view(), name='admin-en-attente'),
    path('admin/publiees/', AdminEntreprisesPublieesView.as_view(), name='admin-publiees'),
    path('admin/statistiques/', AdminStatistiquesView.as_view(), name='admin-stats'),
    path('admin/<slug:slug>/valider/', AdminValiderEntrepriseView.as_view(), name='admin-valider'),
    path('admin/<slug:slug>/refuser/', AdminRefuserEntrepriseView.as_view(), name='admin-refuser'),
    path('admin/<slug:slug>/mettre-en-avant/', AdminMettreEnAvantView.as_view(), name='admin-mettre-en-avant'),
    path('admin/<slug:slug>/retirer-mise-en-avant/', AdminRetirerMiseEnAvantView.as_view(), name='admin-retirer-mise-en-avant'),
    
    # Messagerie routes - Données depuis/vers PostgreSQL
    path('messages/conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('messages/conversations/create/', ConversationCreateView.as_view(), name='conversation-create'),
    path('messages/conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('messages/conversations/<int:conversation_id>/send/', MessageCreateView.as_view(), name='message-create'),
    path('messages/conversations/<int:pk>/archive/', ConversationArchiveView.as_view(), name='conversation-archive'),
    path('messages/unread-count/', UnreadMessagesCountView.as_view(), name='unread-messages-count'),
    
    # Favoris routes - Données depuis/vers PostgreSQL
    path('favoris/', FavorisListView.as_view(), name='favoris-list'),
    path('favoris/add/', FavoriAddView.as_view(), name='favori-add'),
    path('favoris/<slug:slug>/remove/', FavoriRemoveView.as_view(), name='favori-remove'),
    path('favoris/<slug:slug>/status/', FavoriStatusView.as_view(), name='favori-status'),
    path('favoris/count/', FavorisCountView.as_view(), name='favoris-count'),
    
    # Media routes - Upload/Download depuis/vers PostgreSQL + /media/
    path('<slug:slug>/images/', EntrepriseImagesListView.as_view(), name='images-list'),
    path('<slug:slug>/images/upload/', EntrepriseImageUploadView.as_view(), name='image-upload'),
    path('<slug:slug>/images/<int:image_id>/delete/', EntrepriseImageDeleteView.as_view(), name='image-delete'),
    path('<slug:slug>/documents/', EntrepriseDocumentsListView.as_view(), name='documents-list'),
    path('<slug:slug>/documents/upload/', EntrepriseDocumentUploadView.as_view(), name='document-upload'),
    path('<slug:slug>/documents/<int:document_id>/delete/', EntrepriseDocumentDeleteView.as_view(), name='document-delete'),
    
    # Statistiques routes - Données depuis PostgreSQL
    path('statistiques/dashboard/', StatistiquesDashboardVendeurView.as_view(), name='stats-dashboard'),
    path('<slug:slug>/statistiques/', StatistiquesEntrepriseView.as_view(), name='stats-entreprise'),
    path('<slug:slug>/enregistrer-action/', EnregistrerActionView.as_view(), name='enregistrer-action'),
    
    # Detail and update (must be last)
    path('<slug:slug>/', EntrepriseDetailView.as_view(), name='entreprise-detail'),
    path('<slug:slug>/update/', EntrepriseUpdateView.as_view(), name='entreprise-update'),
]
