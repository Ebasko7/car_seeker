from django.contrib import admin
from django.urls import path, include
from .views import Garage

urlpatterns = [
    path('', Garage.as_view(), ),
]



