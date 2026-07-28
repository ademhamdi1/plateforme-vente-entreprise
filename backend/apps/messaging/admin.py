from django.contrib import admin
from django.utils.html import format_html
from .models import Conversation, Message, ContactRequest


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ['sender', 'content', 'is_read', 'created_at']
    can_delete = False
    max_num = 5
    classes = ['collapse']


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['entreprise_info', 'participants', 'status_badge', 'message_count', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['entreprise__nom', 'acheteur__username', 'vendeur__username']
    date_hierarchy = 'created_at'
    inlines = [MessageInline]
    readonly_fields = ['created_at', 'updated_at']
    list_per_page = 25
    
    def entreprise_info(self, obj):
        return format_html(
            '<div style="font-size: 13px;">'
            '<div style="font-weight: 700; color: #1f2937;">🏢 {}</div>'
            '<div style="color: #6b7280; font-size: 11px;">💬 {}</div>'
            '</div>',
            obj.entreprise.nom,
            obj.sujet
        )
    entreprise_info.short_description = '🏢 Entreprise'
    
    def participants(self, obj):
        return format_html(
            '<div style="font-size: 12px; line-height: 1.8;">'
            '<div>👤 <span style="font-weight: 600;">Acheteur:</span> {}</div>'
            '<div>👤 <span style="font-weight: 600;">Vendeur:</span> {}</div>'
            '</div>',
            obj.acheteur.get_full_name() or obj.acheteur.username,
            obj.vendeur.get_full_name() or obj.vendeur.username
        )
    participants.short_description = '👥 Participants'
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background: #10b981; color: white; padding: 5px 12px; '
                'border-radius: 12px; font-weight: 600; font-size: 11px;">✓ ACTIVE</span>'
            )
        return format_html(
            '<span style="background: #6b7280; color: white; padding: 5px 12px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">✗ INACTIVE</span>'
        )
    status_badge.short_description = '📊 Statut'
    
    def message_count(self, obj):
        count = obj.messages.count()
        return format_html(
            '<span style="background: #eff6ff; color: #1e40af; padding: 5px 12px; '
            'border-radius: 12px; font-weight: 700; font-size: 12px;">💬 {}</span>',
            count
        )
    message_count.short_description = '💬 Messages'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sender_info', 'conversation_link', 'content_preview', 'read_badge', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['sender__username', 'content']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
    list_per_page = 25
    
    def sender_info(self, obj):
        return format_html(
            '<div style="font-weight: 700; color: #1f2937;">👤 {}</div>',
            obj.sender.get_full_name() or obj.sender.username
        )
    sender_info.short_description = '👤 Expéditeur'
    
    def conversation_link(self, obj):
        return format_html(
            '<div style="font-size: 12px; color: #6b7280;">🏢 {}</div>',
            obj.conversation.entreprise.nom[:30]
        )
    conversation_link.short_description = '💬 Conversation'
    
    def content_preview(self, obj):
        preview = obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
        return format_html(
            '<div style="font-size: 12px; color: #6b7280; font-style: italic;">"{}"</div>',
            preview
        )
    content_preview.short_description = '📝 Contenu'
    
    def read_badge(self, obj):
        if obj.is_read:
            return format_html(
                '<span style="color: #10b981; font-size: 20px;" title="Lu">✓✓</span>'
            )
        return format_html(
            '<span style="color: #9ca3af; font-size: 20px;" title="Non lu">✓</span>'
        )
    read_badge.short_description = '👁️'


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ['nom', 'entreprise_link', 'contact_info', 'statut_badge', 'created_at']
    list_filter = ['statut', 'created_at']
    search_fields = ['nom', 'email', 'entreprise__nom']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at']
    list_per_page = 25
    
    def entreprise_link(self, obj):
        return format_html(
            '<div style="font-weight: 700; color: #1f2937;">🏢 {}</div>',
            obj.entreprise.nom
        )
    entreprise_link.short_description = '🏢 Entreprise'
    
    def contact_info(self, obj):
        return format_html(
            '<div style="font-size: 12px; line-height: 1.8;">'
            '<div>📧 {}</div>'
            '<div>📞 {}</div>'
            '</div>',
            obj.email,
            obj.telephone
        )
    contact_info.short_description = '📞 Contact'
    
    def statut_badge(self, obj):
        colors = {
            'en_attente': '#f59e0b',
            'acceptee': '#10b981',
            'refusee': '#ef4444'
        }
        icons = {
            'en_attente': '⏳',
            'acceptee': '✓',
            'refusee': '✗'
        }
        color = colors.get(obj.statut, '#6b7280')
        icon = icons.get(obj.statut, '●')
        return format_html(
            '<span style="background: {}; color: white; padding: 5px 14px; '
            'border-radius: 12px; font-weight: 600; font-size: 11px;">{} {}</span>',
            color, icon, obj.get_statut_display().upper()
        )
    statut_badge.short_description = '📊 Statut'
