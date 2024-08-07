from django.contrib import admin
from django.urls import path, include
from .views import GarageView,GaragedCarView

urlpatterns = [
    path('', GarageView.as_view(), name='user-garage'),
    path('cars/', GaragedCarView.as_view(), name='garage-cars'),
    path('cars/<int:car_id>/', GaragedCarView.as_view(), name='garage-car-detail'),
]



