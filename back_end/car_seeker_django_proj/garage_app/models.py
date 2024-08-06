from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_app.models import User

class GaragedCar(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2100)
        ]
    )
    VIN = models.CharField(max_length=17, unique=True)
    services = models.TextField()

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

class Garage(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    cars = models.ForeignKey(GaragedCar, on_delete=models.CASCADE, related_name='garage')

    def __str__(self):
        return f"Garage owned by {self.owner.username}"
    

    