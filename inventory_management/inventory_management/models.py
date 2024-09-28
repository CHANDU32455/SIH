# inventory_management/models.py
from django.db import models
from django.contrib.auth.hashers import make_password

class UserRegistration(models.Model):
    user_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.password = make_password(self.password)
        super(UserRegistration, self).save(*args, **kwargs)

    def __str__(self):
        return self.name

class Stations(models.Model):
    station_id = models.CharField(max_length=50, unique=True, primary_key=True)
    station_name = models.CharField(max_length=50)
    station_location = models.CharField(max_length=200)

    def __str__(self):
        return self.station_name
