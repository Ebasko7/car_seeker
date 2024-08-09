from django.urls import path
from .views import AutoDevLandingView, AutoDevMarketView

urlpatterns = [
    path('', AutoDevLandingView.as_view(), name="landing"),
    path('search/', AutoDevMarketView.as_view(), name="search"),
]