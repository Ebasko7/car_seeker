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
    HTTP_404_NOT_FOUND
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from user_app.views import TokenReq
from .models import Garage, GaragedCar
from .serializers import GaragedCarSerializer, GarageSerializer


class GarageView(TokenReq):
    def get(self, request):
        user = request.user
        try:
            garage = get_object_or_404(Garage, owner=user)
            serialized_garage = GarageSerializer(garage)
            return Response(serialized_garage.data, status=HTTP_200_OK)
        except Garage.DoesNotExist:
            return Response({"error": "Garage not found for this user"}, status=HTTP_404_NOT_FOUND)
    

class GaragedCarView(TokenReq):

    def get(self, request):
        user = request.user
        cars = GaragedCar.objects.filter(garage__owner=user)
        serializer = GaragedCarSerializer(cars, many=True)
        print(serializer)
        return Response(serializer.data, status=HTTP_200_OK)


    def post(self, request):
        user = request.user
        print(f'USER: {user}')
        try:
            garage = Garage.objects.get(owner=user)
            print(f'GARAGE: {garage}')
        except Garage.DoesNotExist:
            return Response({"error": "User does not have a garage"}, status=HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        print(f'DATA: {data}')
        data['garage'] = garage.id
        
        serializer = GaragedCarSerializer(data=data)
        print(f'GARAGED CAR SERIALIZER: {serializer}')
        if serializer.is_valid():
            serializer.save()
            print('NEW CAR SAVED')
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def put(self, request, car_id):
        user = request.user
        try:
            car = GaragedCar.objects.get(id=car_id, garage__owner=user)
            serializer = GaragedCarSerializer(car, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except GaragedCar.DoesNotExist:
            return Response({"error": "Car not found or you don't have permission"}, status=HTTP_404_NOT_FOUND)

    def delete(self, request, car_id):
        user = request.user
        try:
            car = GaragedCar.objects.get(id=car_id, garage__owner=user)
            print(car)
        except GaragedCar.DoesNotExist:
            return Response({"error": "Car not found or you don't have permission"}, status=HTTP_404_NOT_FOUND)
        
        car.delete()
        print('CAR DELETED')
        return Response(status=HTTP_204_NO_CONTENT)
        






