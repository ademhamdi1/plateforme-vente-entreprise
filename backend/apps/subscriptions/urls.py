from django.urls import path
from .views import (
    PlanListView,
    SubscriptionCreateView,
    MySubscriptionView,
    SubscriptionListView,
    PaymentListView
)

app_name = 'subscriptions'

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('subscribe/', SubscriptionCreateView.as_view(), name='subscribe'),
    path('my-subscription/', MySubscriptionView.as_view(), name='my-subscription'),
    path('history/', SubscriptionListView.as_view(), name='subscription-history'),
    path('payments/', PaymentListView.as_view(), name='payment-list'),
]
