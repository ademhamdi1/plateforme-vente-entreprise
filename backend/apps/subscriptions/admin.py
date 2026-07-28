from django.contrib import admin
from django.utils.html import format_html
from .models import Plan, Subscription, Payment


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ['icon_name', 'price_badge', 'max_annonces', 'features_summary', 'status_badge', 'order', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['order', 'is_active']
    list_per_page = 25
    
    fieldsets = (
        ('📋 Informations générales', {
            'fields': ('name', 'slug', 'description', 'price', 'duration_days', 'is_active', 'order')
        }),
        ('✨ Fonctionnalités', {
            'fields': (
                'max_annonces', 'mise_en_avant', 'statistiques_avancees',
                'support_prioritaire', 'badge_verifie', 'publicite_premium',
                'accompagnement_personnalise'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def icon_name(self, obj):
        icons = {
            'gratuit': '🆓',
            'premium': '⭐',
            'professionnel': '👑'
        }
        icon = icons.get(obj.slug, '📦')
        return format_html(
            '<span style="font-size: 24px; margin-right: 8px;">{}</span>'
            '<span style="font-weight: 700; font-size: 15px;">{}</span>',
            icon, obj.name
        )
    icon_name.short_description = '💼 Plan'
    
    def price_badge(self, obj):
        if obj.price == 0:
            return format_html(
                '<span style="background: #10b981; color: white; padding: 6px 16px; '
                'border-radius: 12px; font-weight: 700; font-size: 14px;">GRATUIT</span>'
            )
        return format_html(
            '<span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); '
            'color: white; padding: 6px 16px; border-radius: 12px; font-weight: 700; font-size: 14px;">'
            '{} TND/mois</span>',
            int(obj.price)
        )
    price_badge.short_description = '💰 Prix'
    price_badge.admin_order_field = 'price'
    
    def features_summary(self, obj):
        features = []
        if obj.mise_en_avant:
            features.append('⭐')
        if obj.statistiques_avancees:
            features.append('📊')
        if obj.support_prioritaire:
            features.append('🎯')
        if obj.badge_verifie:
            features.append('✓')
        if obj.publicite_premium:
            features.append('📢')
        if obj.accompagnement_personnalise:
            features.append('🤝')
        
        return format_html(' '.join(features) if features else '-')
    features_summary.short_description = '✨ Fonctionnalités'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background: #10b981; color: white; padding: 5px 12px; '
                'border-radius: 12px; font-weight: 600; font-size: 11px;">✓ ACTIF</span>'
            )
        return format_html(
            '<span style="background: #6b7280; color: white; padding: 5px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">✗ INACTIF</span>'
        )
    status_badge.short_description = '📊 Statut'


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan_badge', 'statut_badge', 'dates_info', 'auto_renew_badge']
    list_filter = ['statut', 'auto_renew', 'plan']
    search_fields = ['user__username', 'user__email']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25
    
    def plan_badge(self, obj):
        colors = {
            'gratuit': '#10b981',
            'premium': '#f59e0b',
            'professionnel': '#8b5cf6'
        }
        color = colors.get(obj.plan.slug, '#6b7280')
        return format_html(
            '<span style="background: {}; color: white; padding: 6px 14px; '
            'border-radius: 12px; font-weight: 700; font-size: 12px;">{}</span>',
            color, obj.plan.name.upper()
        )
    plan_badge.short_description = '💼 Plan'
    
    def statut_badge(self, obj):
        colors = {
            'active': '#10b981',
            'expired': '#ef4444',
            'cancelled': '#6b7280'
        }
        icons = {
            'active': '✓',
            'expired': '⏳',
            'cancelled': '✗'
        }
        color = colors.get(obj.statut, '#6b7280')
        icon = icons.get(obj.statut, '●')
        return format_html(
            '<span style="background: {}; color: white; padding: 5px 14px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">{} {}</span>',
            color, icon, obj.get_statut_display().upper()
        )
    statut_badge.short_description = '📊 Statut'
    
    def dates_info(self, obj):
        return format_html(
            '<div style="font-size: 12px; line-height: 1.6;">'
            '<div>📅 <strong>Début:</strong> {}</div>'
            '<div>⏰ <strong>Fin:</strong> {}</div>'
            '</div>',
            obj.start_date.strftime('%d/%m/%Y'),
            obj.end_date.strftime('%d/%m/%Y')
        )
    dates_info.short_description = '📅 Période'
    
    def auto_renew_badge(self, obj):
        if obj.auto_renew:
            return format_html('<span style="color: #10b981; font-size: 20px;" title="Renouvellement auto">🔄</span>')
        return format_html('<span style="color: #d1d5db;">-</span>')
    auto_renew_badge.short_description = '🔄'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['subscription_info', 'amount_badge', 'statut_badge', 'payment_method', 'paid_at']
    list_filter = ['statut', 'payment_method']
    search_fields = ['subscription__user__username', 'transaction_id']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
    list_per_page = 25
    
    def subscription_info(self, obj):
        return format_html(
            '<div style="font-size: 13px;">'
            '<div style="font-weight: 700; color: #1f2937;">👤 {}</div>'
            '<div style="color: #6b7280; font-size: 11px;">📦 {}</div>'
            '</div>',
            obj.subscription.user.username,
            obj.subscription.plan.name
        )
    subscription_info.short_description = '👤 Abonnement'
    
    def amount_badge(self, obj):
        return format_html(
            '<span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); '
            'color: white; padding: 6px 16px; border-radius: 12px; font-weight: 800; font-size: 14px;">'
            '{} TND</span>',
            int(obj.amount)
        )
    amount_badge.short_description = '💵 Montant'
    amount_badge.admin_order_field = 'amount'
    
    def statut_badge(self, obj):
        colors = {
            'pending': '#f59e0b',
            'completed': '#10b981',
            'failed': '#ef4444',
            'refunded': '#6b7280'
        }
        icons = {
            'pending': '⏳',
            'completed': '✓',
            'failed': '✗',
            'refunded': '↩'
        }
        color = colors.get(obj.statut, '#6b7280')
        icon = icons.get(obj.statut, '●')
        return format_html(
            '<span style="background: {}; color: white; padding: 5px 14px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">{} {}</span>',
            color, icon, obj.get_statut_display().upper()
        )
    statut_badge.short_description = '📊 Statut'
