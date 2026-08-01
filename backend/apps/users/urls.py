from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserRegistrationView, UserProfileView, UserLoginView
from .email_verification_views import (
    SendVerificationEmailView,
    VerifyEmailView,
    RequestPasswordResetView,
    PasswordResetConfirmView,
)
from .abonnement_views import (
    MonAbonnementView,
    PlansDisponiblesView,
    UpgradeAbonnementView,
    AnnulerAbonnementView,
    HistoriquePaiementsView,
    TelechargerFactureView,
)
from .notification_views import (
    NotificationsListView,
    NotificationsNonLuesCountView,
    MarquerCommeLueView,
    MarquerToutCommeLuView,
)
from .temoignage_views import (
    TemoignagesPublicsListView,
    TemoignageCreateView,
    MesTemoignagesView,
    AdminTemoignagesListView,
    AdminPublierTemoignageView,
    AdminSupprimerTemoignageView,
    AdminStatistiquesTemoignagesView,
)
from .alerte_views import (
    MesAlertesView,
    AlerteCreateView,
    AlerteDetailView,
    AlerteToggleView,
)
from .contact_views import ContactMessageView
from .payment_views import (
    CreateCheckoutSessionView,
    CreatePaymentIntentView,
    StripeWebhookView,
    GetStripePublicKeyView,
)
from .demo_payment_views import DemoPaymentView

urlpatterns = [
    # Authentification
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),  # Custom login view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Vérification email & Reset password
    path('send-verification-email/', SendVerificationEmailView.as_view(), name='send-verification-email'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('password-reset-request/', RequestPasswordResetView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    
    # Profil
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Contact - Données depuis/vers PostgreSQL (accessible à tous)
    path('contact/', ContactMessageView.as_view(), name='contact'),
    
    # Payment - Stripe (données sauvegardées dans PostgreSQL)
    path('payment/public-key/', GetStripePublicKeyView.as_view(), name='stripe-public-key'),
    path('payment/create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout'),
    path('payment/create-payment-intent/', CreatePaymentIntentView.as_view(), name='create-payment-intent'),
    path('payment/webhook/', StripeWebhookView.as_view(), name='stripe-webhook'),
    path('payment/demo/', DemoPaymentView.as_view(), name='demo-payment'),
    
    # Abonnements - Données depuis/vers PostgreSQL
    path('abonnement/', MonAbonnementView.as_view(), name='mon-abonnement'),
    path('abonnement/plans/', PlansDisponiblesView.as_view(), name='plans-disponibles'),
    path('abonnement/upgrade/', UpgradeAbonnementView.as_view(), name='upgrade-abonnement'),
    path('abonnement/annuler/', AnnulerAbonnementView.as_view(), name='annuler-abonnement'),
    path('abonnement/paiements/', HistoriquePaiementsView.as_view(), name='historique-paiements'),
    path('abonnement/facture/<int:paiement_id>/', TelechargerFactureView.as_view(), name='telecharger-facture'),
    
    # Notifications - Données depuis/vers PostgreSQL
    path('notifications/', NotificationsListView.as_view(), name='notifications-list'),
    path('notifications/count/', NotificationsNonLuesCountView.as_view(), name='notifications-count'),
    path('notifications/<int:pk>/lue/', MarquerCommeLueView.as_view(), name='marquer-lue'),
    path('notifications/marquer-tout-lu/', MarquerToutCommeLuView.as_view(), name='marquer-tout-lu'),
    
    # Témoignages - Données depuis/vers PostgreSQL
    path('temoignages/publics/', TemoignagesPublicsListView.as_view(), name='temoignages-publics'),
    path('temoignages/create/', TemoignageCreateView.as_view(), name='temoignage-create'),
    path('temoignages/mes-temoignages/', MesTemoignagesView.as_view(), name='mes-temoignages'),
    
    # Témoignages Admin
    path('temoignages/admin/', AdminTemoignagesListView.as_view(), name='admin-temoignages'),
    path('temoignages/admin/<int:pk>/publier/', AdminPublierTemoignageView.as_view(), name='admin-publier-temoignage'),
    path('temoignages/admin/<int:pk>/supprimer/', AdminSupprimerTemoignageView.as_view(), name='admin-supprimer-temoignage'),
    path('temoignages/admin/stats/', AdminStatistiquesTemoignagesView.as_view(), name='admin-stats-temoignages'),
    
    # Alertes de recherche - Données depuis/vers PostgreSQL (acheteurs uniquement)
    path('alertes/', MesAlertesView.as_view(), name='mes-alertes'),
    path('alertes/create/', AlerteCreateView.as_view(), name='alerte-create'),
    path('alertes/<int:pk>/', AlerteDetailView.as_view(), name='alerte-detail'),
    path('alertes/<int:pk>/toggle/', AlerteToggleView.as_view(), name='alerte-toggle'),
]
