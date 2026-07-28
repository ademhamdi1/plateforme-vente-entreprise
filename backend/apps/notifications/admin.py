from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['titre', 'user', 'type', 'est_lu', 'created_at']
    list_filter = ['type', 'est_lu', 'created_at']
    search_fields = ['titre', 'message', 'user__email']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
