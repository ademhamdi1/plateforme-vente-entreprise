from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Entreprise, EntrepriseImage, EntrepriseDocument


class EntrepriseImageInline(admin.TabularInline):
    model = EntrepriseImage
    extra = 1
    fields = ['image', 'caption', 'is_logo', 'order']
    classes = ['collapse']


class EntrepriseDocumentInline(admin.TabularInline):
    model = EntrepriseDocument
    extra = 1
    fields = ['document', 'titre', 'description']
    classes = ['collapse']


@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = [
        'nom', 'region_badge', 'prix_formatted',
        'statut_badge', 'featured_badge', 'views_badge', 'created_at'
    ]
    list_filter = ['statut', 'region', 'type_transaction', 'est_mise_en_avant', 'created_at']
    search_fields = ['nom', 'description', 'ville', 'vendeur__username', 'vendeur__email']
    prepopulated_fields = {'slug': ('nom',)}
    date_hierarchy = 'created_at'
    inlines = [EntrepriseImageInline, EntrepriseDocumentInline]
    list_per_page = 20
    autocomplete_fields = ['vendeur']
    
    fieldsets = (
        ('📋 Informations générales', {
            'fields': ('nom', 'slug', 'description', 'region', 'ville', 'adresse'),
            'classes': ('wide',)
        }),
        ('💰 Informations financières', {
            'fields': ('prix_demande', 'chiffre_affaires', 'resultat_net', 'valeur_actifs', 'endettement'),
            'classes': ('collapse',)
        }),
        ('🏭 Informations opérationnelles', {
            'fields': ('nombre_employes', 'annee_creation', 'surface_local', 'equipements_inclus'),
            'classes': ('collapse',)
        }),
        ('🤝 Transaction', {
            'fields': ('type_transaction', 'points_forts', 'opportunites_developpement'),
            'classes': ('collapse',)
        }),
        ('🔒 Confidentialité', {
            'fields': ('nom_masque', 'adresse_masquee'),
            'classes': ('collapse',)
        }),
        ('⚙️ Gestion', {
            'fields': ('vendeur', 'statut', 'est_mise_en_avant', 'nombre_vues'),
        }),
    )
    
    readonly_fields = ['nombre_vues']
    
    actions = ['publier_entreprises', 'refuser_entreprises', 'mettre_en_avant']
    
    def statut_badge(self, obj):
        colors = {
            'brouillon': '#f59e0b',
            'en_attente': '#3b82f6',
            'publiee': '#10b981',
            'refusee': '#ef4444',
            'vendue': '#6b7280'
        }
        icons = {
            'brouillon': '📝',
            'en_attente': '⏳',
            'publiee': '✅',
            'refusee': '❌',
            'vendue': '🏆'
        }
        color = colors.get(obj.statut, '#6b7280')
        icon = icons.get(obj.statut, '📄')
        return format_html(
            '<span style="background: {}; color: white; padding: 5px 14px; '
            'border-radius: 14px; font-weight: 600; font-size: 11px; text-transform: uppercase;">'
            '{} {}</span>',
            color, icon, obj.get_statut_display()
        )
    statut_badge.short_description = '📊 Statut'
    statut_badge.admin_order_field = 'statut'
    
    def featured_badge(self, obj):
        if obj.est_mise_en_avant:
            return format_html(
                '<span style="font-size: 24px;" title="En vedette">⭐</span>'
            )
        return format_html('<span style="color: #d1d5db;">-</span>')
    featured_badge.short_description = '⭐'
    
    def views_badge(self, obj):
        return format_html(
            '<span style="background: #f3f4f6; color: #374151; padding: 4px 10px; '
            'border-radius: 10px; font-weight: 600; font-size: 12px;">👁️ {}</span>',
            obj.nombre_vues
        )
    views_badge.short_description = '👁️ Vues'
    views_badge.admin_order_field = 'nombre_vues'
    
    def prix_formatted(self, obj):
        return format_html(
            '<span style="color: #10b981; font-weight: 700; font-size: 14px;">{:,.0f} TND</span>',
            obj.prix_demande
        )
    prix_formatted.short_description = '💵 Prix'
    prix_formatted.admin_order_field = 'prix_demande'
    
    def region_badge(self, obj):
        return format_html(
            '<span style="background: #eff6ff; color: #1e40af; padding: 4px 10px; '
            'border-radius: 10px; font-weight: 600; font-size: 11px;">📍 {}</span>',
            obj.get_region_display()
        )
    region_badge.short_description = '📍 Région'
    region_badge.admin_order_field = 'region'
    
    def publier_entreprises(self, request, queryset):
        updated = queryset.update(statut='publiee')
        self.message_user(request, f'✅ {updated} entreprise(s) publiée(s) avec succès.', 'success')
    publier_entreprises.short_description = "✅ Publier les entreprises sélectionnées"
    
    def refuser_entreprises(self, request, queryset):
        updated = queryset.update(statut='refusee')
        self.message_user(request, f'❌ {updated} entreprise(s) refusée(s).', 'warning')
    refuser_entreprises.short_description = "❌ Refuser les entreprises sélectionnées"
    
    def mettre_en_avant(self, request, queryset):
        updated = queryset.update(est_mise_en_avant=True)
        self.message_user(request, f'⭐ {updated} entreprise(s) mise(s) en avant.', 'success')
    mettre_en_avant.short_description = "⭐ Mettre en avant"


@admin.register(EntrepriseImage)
class EntrepriseImageAdmin(admin.ModelAdmin):
    list_display = ['image_preview', 'entreprise', 'caption', 'logo_badge', 'order', 'uploaded_at']
    list_filter = ['is_logo', 'uploaded_at']
    search_fields = ['entreprise__nom', 'caption']
    list_per_page = 25
    
    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; '
                'border-radius: 8px; border: 2px solid #e5e7eb;"/>',
                obj.image.url
            )
        return '-'
    image_preview.short_description = '🖼️ Aperçu'
    
    def logo_badge(self, obj):
        if obj.is_logo:
            return format_html('<span style="font-size: 20px;">⭐</span>')
        return '-'
    logo_badge.short_description = 'Logo'


@admin.register(EntrepriseDocument)
class EntrepriseDocumentAdmin(admin.ModelAdmin):
    list_display = ['titre', 'entreprise', 'document_type', 'uploaded_at']
    list_filter = ['uploaded_at']
    search_fields = ['titre', 'entreprise__nom', 'description']
    list_per_page = 25
    
    def document_type(self, obj):
        return format_html(
            '<span style="background: #fef3c7; color: #92400e; padding: 4px 10px; '
            'border-radius: 10px; font-weight: 600; font-size: 11px;">📄 PDF</span>'
        )
    document_type.short_description = 'Type'
