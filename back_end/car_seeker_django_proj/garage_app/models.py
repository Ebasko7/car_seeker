from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_app.models import User

class Garage(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Garage owned by {self.owner.username}"

class GaragedCar(models.Model):
    make = models.CharField(max_length=100, default='Ford')
    model = models.CharField(max_length=100, default='Mustang')
    year = models.IntegerField( default = 2017,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2100)
        ]
    )
    VIN = models.CharField(max_length=17, unique=False, default='XXX-XXX-XXX-XXX')
    services = models.TextField(default='')
    garage = models.ForeignKey(Garage, on_delete=models.CASCADE, related_name='cars')

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"