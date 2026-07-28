from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User, SavedEntreprise, Alert


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'user_type_badge', 'verification_badge', 'phone', 'created_at']
    list_filter = ['user_type', 'is_verified', 'is_staff', 'is_active', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    date_hierarchy = 'created_at'
    list_per_page = 25
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('🔹 Informations supplémentaires', {
            'fields': ('user_type', 'phone', 'address', 'city', 'region', 'profile_picture', 'is_verified'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('🔹 Informations supplémentaires', {
            'fields': ('user_type', 'phone', 'email'),
            'classes': ('wide',)
        }),
    )
    
    def user_type_badge(self, obj):
        colors = {
            'acheteur': '#3b82f6',
            'vendeur': '#10b981',
            'admin': '#ef4444'
        }
        color = colors.get(obj.user_type, '#6b7280')
        return format_html(
            '<span style="background: {}; color: white; padding: 4px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 12px;">{}</span>',
            color, obj.get_user_type_display()
        )
    user_type_badge.short_description = '👤 Type'
    
    def verification_badge(self, obj):
        if obj.is_verified:
            return format_html(
                '<span style="color: #10b981; font-size: 20px;" title="Vérifié">✓</span>'
            )
        return format_html(
            '<span style="color: #ef4444; font-size: 20px;" title="Non vérifié">✗</span>'
        )
    verification_badge.short_description = '✓ Vérifié'


@admin.register(SavedEntreprise)
class SavedEntrepriseAdmin(admin.ModelAdmin):
    list_display = ['user', 'entreprise', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'entreprise__nom']
    date_hierarchy = 'created_at'
    autocomplete_fields = ['user', 'entreprise']
    list_per_page = 25


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'region', 'status_badge', 'created_at']
    list_filter = ['is_active', 'region', 'created_at']
    search_fields = ['user__username', 'name']
    date_hierarchy = 'created_at'
    autocomplete_fields = ['user']
    list_per_page = 25
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background: #10b981; color: white; padding: 4px 12px; '
                'border-radius: 12px; font-weight: 600; font-size: 11px;">🔔 ACTIVE</span>'
            )
        return format_html(
            '<span style="background: #6b7280; color: white; padding: 4px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">🔕 INACTIVE</span>'
        )
    status_badge.short_description = '📊 Statut'
