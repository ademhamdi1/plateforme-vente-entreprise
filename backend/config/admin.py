from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html


class CustomAdminSite(AdminSite):
    site_header = format_html(
        '<span style="font-size: 24px; font-weight: 800; '
        'background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); '
        '-webkit-background-clip: text; -webkit-text-fill-color: transparent;">'
        'BusinessBuy Administration</span>'
    )
    site_title = 'BusinessBuy Admin'
    index_title = format_html(
        '<span style="font-size: 28px; font-weight: 800; color: #1f2937;">'
        '📊 Tableau de bord BusinessBuy</span>'
    )
    site_url = '/api/'
    
    def each_context(self, request):
        context = super().each_context(request)
        context['site_header_safe'] = self.site_header
        return context


# Remplacer le site admin par défaut
admin.site = CustomAdminSite()
admin.sites.site = admin.site
