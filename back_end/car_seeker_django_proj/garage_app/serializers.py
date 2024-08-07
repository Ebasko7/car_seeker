from .models import GaragedCar, Garage
from rest_framework.serializers import ModelSerializer

class GaragedCarSerializer(ModelSerializer):
    class Meta:
        model = GaragedCar
        fields = "__all__"

class GarageSerializer(ModelSerializer):
    cars = GaragedCarSerializer(many=True, read_only=True)

    class Meta:
        model = Garage
        fields = '__all__'

        