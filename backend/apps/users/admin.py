from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .abonnement_models import Abonnement, HistoriquePaiement
from .notification_models import Notification
from .temoignage_models import Temoignage
from .alerte_models import AlerteRecherche
from .contact_models import ContactMessage


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'user_type', 'is_verified', 'created_at']
    list_filter = ['user_type', 'is_verified', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {
            'fields': ('user_type', 'phone', 'address', 'city', 'region', 'is_verified')
        }),
    )


@admin.register(Abonnement)
class AbonnementAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'plan', 'statut', 'date_debut', 'date_fin', 'auto_renouvellement']
    list_filter = ['plan', 'statut', 'auto_renouvellement']
    search_fields = ['utilisateur__username', 'utilisateur__email']
    date_hierarchy = 'date_debut'
    readonly_fields = ['created_at', 'updated_at']


@admin.register(HistoriquePaiement)
class HistoriquePaiementAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'montant', 'devise', 'plan', 'statut', 'created_at']
    list_filter = ['statut', 'plan', 'methode_paiement']
    search_fields = ['utilisateur__username', 'transaction_id']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'type', 'titre', 'est_lue', 'created_at']
    list_filter = ['type', 'est_lue']
    search_fields = ['utilisateur__username', 'titre', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']


@admin.register(Temoignage)
class TemoignageAdmin(admin.ModelAdmin):
    list_display = ['utilisateur', 'entreprise_concernee', 'note', 'est_publie', 'created_at']
    list_filter = ['est_publie', 'note']
    search_fields = ['utilisateur__username', 'entreprise_concernee', 'contenu']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    actions = ['publier_temoignages', 'depublier_temoignages']
    
    def publier_temoignages(self, request, queryset):
        updated = queryset.update(est_publie=True)
        self.message_user(request, f'{updated} témoignage(s) publié(s).')
    publier_temoignages.short_description = "Publier les témoignages sélectionnés"
    
    def depublier_temoignages(self, request, queryset):
        updated = queryset.update(est_publie=False)
        self.message_user(request, f'{updated} témoignage(s) dépublié(s).')
    depublier_temoignages.short_description = "Dépublier les témoignages sélectionnés"


@admin.register(AlerteRecherche)
class AlerteRechercheAdmin(admin.ModelAdmin):
    list_display = ['nom_alerte', 'acheteur', 'secteur', 'region', 'active', 'frequence', 'created_at']
    list_filter = ['active', 'frequence', 'secteur', 'region']
    search_fields = ['nom_alerte', 'acheteur__username', 'acheteur__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at', 'derniere_notification']
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('acheteur', 'nom_alerte', 'active', 'frequence')
        }),
        ('Critères de recherche', {
            'fields': ('secteur', 'region', 'prix_min', 'prix_max', 
                      'ca_min', 'ca_max', 'nombre_employes_min', 'nombre_employes_max',
                      'type_transaction')
        }),
        ('Suivi', {
            'fields': ('derniere_notification', 'created_at', 'updated_at')
        }),
    )



@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['nom', 'email', 'sujet', 'statut', 'created_at']
    list_filter = ['statut', 'sujet', 'created_at']
    search_fields = ['nom', 'email', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Message', {
            'fields': ('nom', 'email', 'sujet', 'message', 'utilisateur')
        }),
        ('Traitement', {
            'fields': ('statut', 'reponse')
        }),
        ('Suivi', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    actions = ['marquer_en_cours', 'marquer_resolu', 'marquer_ferme']
    
    def marquer_en_cours(self, request, queryset):
        updated = queryset.update(statut='en_cours')
        self.message_user(request, f'{updated} message(s) marqué(s) en cours.')
    marquer_en_cours.short_description = "Marquer en cours"
    
    def marquer_resolu(self, request, queryset):
        updated = queryset.update(statut='resolu')
        self.message_user(request, f'{updated} message(s) marqué(s) résolu(s).')
    marquer_resolu.short_description = "Marquer résolu"
    
    def marquer_ferme(self, request, queryset):
        updated = queryset.update(statut='ferme')
        self.message_user(request, f'{updated} message(s) fermé(s).')
    marquer_ferme.short_description = "Marquer fermé"
