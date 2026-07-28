from django.urls import path
from .views import (
    ConversationListView,
    ConversationDetailView,
    MessageCreateView,
    ContactRequestCreateView,
    ContactRequestListView
)

app_name = 'messaging'

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('messages/create/', MessageCreateView.as_view(), name='message-create'),
    path('contact-requests/', ContactRequestListView.as_view(), name='contact-request-list'),
    path('contact-requests/create/', ContactRequestCreateView.as_view(), name='contact-request-create'),
]
