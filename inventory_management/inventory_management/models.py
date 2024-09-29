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

class Asset(models.Model):
    ASSET_TYPE_CHOICES = [
        ('VEHICLE', 'Vehicle'),
        ('WEAPON', 'Weapon'),
        ('ELECTRONIC', 'Electronic Device'),
        ('PROTECTIVE_GEAR', 'Protective Gear'),
        ('OFFICE_EQUIPMENT', 'Office Equipment'),
        ('MISC', 'Miscellaneous Equipment'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('MOVING', 'Moving'),
        ('MOVED', 'Moved'),
    ]
    
    asset_id = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, default='inventory')
    last_location = models.CharField(max_length=100, default='inventory')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='INACTIVE')
    asset_type = models.CharField(max_length=50, choices=ASSET_TYPE_CHOICES)
    expiry_date = models.DateField()

    def __str__(self): 
        return self.name
