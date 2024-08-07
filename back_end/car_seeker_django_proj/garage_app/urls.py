from django.contrib import admin
from django.urls import path, include
from .views import GarageView

urlpatterns = [
    path('', GarageView.as_view(), ),
]



