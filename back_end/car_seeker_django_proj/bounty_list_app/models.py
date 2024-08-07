from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from user_app.models import User

class Bounty_filter(models.Model):
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.IntegerField(
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(2025)
        ]
    )
    max_price = models.BigIntegerField()

class Bounty_list(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='bounty_list')
    filters = models.ManyToManyField(Bounty_filter)