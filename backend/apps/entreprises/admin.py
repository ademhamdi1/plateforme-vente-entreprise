from django.contrib import admin
from .models import Entreprise, EntrepriseImage, EntrepriseDocument
from .favoris_models import Favori
from .messaging_models import Conversation, Message
from .statistiques_models import StatistiqueVue, StatistiqueAction, StatistiqueConversion
from .actualite_models import Actualite


class EntrepriseImageInline(admin.TabularInline):
    model = EntrepriseImage
    extra = 1


class EntrepriseDocumentInline(admin.TabularInline):
    model = EntrepriseDocument
    extra = 1


@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = ['nom', 'vendeur', 'secteur', 'region', 'prix_demande', 'statut', 'nombre_vues', 'created_at']
    list_filter = ['statut', 'secteur', 'region', 'type_transaction']
    search_fields = ['nom', 'description', 'ville']
    readonly_fields = ['slug', 'nombre_vues', 'created_at', 'updated_at']
    inlines = [EntrepriseImageInline, EntrepriseDocumentInline]
    
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'slug', 'description', 'secteur', 'region', 'ville', 'historique')
        }),
        ('Informations financières', {
            'fields': ('prix_demande', 'chiffre_affaires', 'resultat_net', 'valeur_actifs', 'endettement')
        }),
        ('Informations opérationnelles', {
            'fields': ('nombre_employes', 'annee_creation', 'surface_local', 'equipements_inclus')
        }),
        ('Médias', {
            'fields': ('video_url',)
        }),
        ('Transaction', {
            'fields': ('type_transaction', 'points_forts', 'opportunites_developpement')
        }),
        ('Confidentialité', {
            'fields': ('nom_masque', 'adresse_masquee')
        }),
        ('Gestion', {
            'fields': ('vendeur', 'statut', 'raison_refus', 'est_mise_en_avant', 'nombre_vues')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at', 'published_at')
        }),
    )


@admin.register(EntrepriseImage)
class EntrepriseImageAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'caption', 'is_logo', 'order', 'uploaded_at']
    list_filter = ['is_logo', 'uploaded_at']
    search_fields = ['entreprise__nom', 'caption']
    ordering = ['entreprise', 'order']


@admin.register(EntrepriseDocument)
class EntrepriseDocumentAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'titre', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['entreprise__nom', 'titre', 'description']
    ordering = ['-uploaded_at']


@admin.register(Favori)
class FavoriAdmin(admin.ModelAdmin):
    list_display = ['acheteur', 'entreprise', 'created_at']
    list_filter = ['created_at']
    search_fields = ['acheteur__username', 'entreprise__nom']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ['sender', 'content', 'created_at']
    can_delete = False
    max_num = 10


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'acheteur', 'vendeur', 'created_at', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['entreprise__nom', 'acheteur__username', 'vendeur__username']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MessageInline]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['conversation', 'sender', 'content_preview', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['conversation__entreprise__nom', 'sender__username', 'content']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Contenu'


@admin.register(StatistiqueVue)
class StatistiqueVueAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'date', 'nombre_vues', 'nombre_vues_uniques', 'temps_moyen_secondes']
    list_filter = ['date']
    search_fields = ['entreprise__nom']
    date_hierarchy = 'date'


@admin.register(StatistiqueAction)
class StatistiqueActionAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'utilisateur', 'action', 'ip_address', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['entreprise__nom', 'utilisateur__username', 'ip_address']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']


@admin.register(StatistiqueConversion)
class StatistiqueConversionAdmin(admin.ModelAdmin):
    list_display = ['entreprise', 'date', 'nombre_vues', 'nombre_contacts', 'taux_conversion']
    list_filter = ['date']
    search_fields = ['entreprise__nom']
    date_hierarchy = 'date'
    readonly_fields = ['taux_conversion']



# =====================================
# ACTUALITÉS
# =====================================
@admin.register(Actualite)
class ActualiteAdmin(admin.ModelAdmin):
    list_display = ['titre', 'auteur', 'est_publiee', 'date_publication', 'created_at']
    list_filter = ['est_publiee', 'date_publication', 'created_at']
    search_fields = ['titre', 'contenu']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    date_hierarchy = 'date_publication'
    
    fieldsets = (
        ('Informations principales', {
            'fields': ('titre', 'slug', 'contenu', 'image', 'auteur')
        }),
        ('Publication', {
            'fields': ('est_publiee', 'date_publication')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.auteur:
            obj.auteur = request.user
        super().save_model(request, obj, form, change)
