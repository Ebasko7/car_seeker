from django.shortcuts import render, get_object_or_404
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from user_app.views import TokenReq
from .models import Garage, GaragedCar
from .serializers import GaragedCarSerializer, GarageSerializer


class GarageView(TokenReq):
    def get (self, request):
        user = request.user
        garage = get_object_or_404(Garage.objects.get(owner=user))
        serialized_garage = GarageSerializer(garage)
        print(serialized_garage)
        return Response(serialized_garage.data)
    


#VIEW OF CARS IN GARAGE(GET)

#VIEW TO ADD CAR (POST). This will take in a VIN and call the CARAPI to populate Cardata. 
    
    def post(self, request):
        user = request.user 
        #data = request to carAPI 

#VIEW TO UPDATE A CAR (PUT). This view will take in user text to update serviceslist.

#VIEW TO DELETE A CAR (DELETE). 


