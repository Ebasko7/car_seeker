from django.urls import path
from .views import AutoDevLandingView, AutoDevMarketView

#FIRST ENDPOINT, UTILIZED IN MAINPAGE.JSX COMPONENT: api/v1/autodev/
#SECOND ENDPOINT, UTILIZED BY SEARCHCARS.JSX COMPONENT: api/v1/autodev/search/
urlpatterns = [
    path('', AutoDevLandingView.as_view(), name="landing"),
    path('search/', AutoDevMarketView.as_view(), name="search"),
]