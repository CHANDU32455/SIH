from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.core.exceptions import ValidationError

class UserRegistration(models.Model):
    user_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    station = models.ForeignKey('Stations', on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Check if this is an existing instance and the password has changed
        if self.pk:
            orig = UserRegistration.objects.get(pk=self.pk)
            if orig.password != self.password:
                self.password = make_password(self.password)
        else:
            # Hash the password for new instances
            self.password = make_password(self.password)
        
        super(UserRegistration, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


class Stations(models.Model):
    station_id = models.CharField(max_length=50, unique=True, primary_key=True)
    station_master_id = models.ForeignKey(UserRegistration, on_delete=models.CASCADE, null=True)
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
        ('UNDER_REPAIR', 'under_repair'),
        ('DECOMMISSIONED', 'Decommissioned'),    
    ]
    
    asset_id = models.CharField(max_length=50, unique=True, primary_key=True)
    station_id = models.ForeignKey(Stations, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, db_index=True)
    location = models.CharField(max_length=100, default='inventory')
    last_location = models.CharField(max_length=100, default='inventory')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='INACTIVE', db_index=True)
    asset_type = models.CharField(max_length=50, choices=ASSET_TYPE_CHOICES, db_index=True)
    manufactured_date = models.DateField(default=timezone.now)
    expiry_date = models.DateField()

    def clean(self):
        # Ensure that the expiry_date is later than manufactured_date
        if self.expiry_date <= self.manufactured_date:
            raise ValidationError("Expiry date must be after the manufactured date.")
    @property
    def get_asset_id(self):
        return self.asset_id
    def __str__(self):
        return self.name

class AuditLog(models.Model):
    UTILIZATION_CHOICES = [
        ('IN_USE', 'In_Use'),
        ('IDLE', 'Idle'),
        ('UNAVAILABLE', 'Unavailable'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('UNDER_REPAIR', 'under_repair'),
        ('DECOMMISSIONED', 'Decommissioned'),    
    ]
    
    audit_log_id = models.ForeignKey(Asset, on_delete=models.CASCADE)
    audit_date = models.DateTimeField(auto_now_add=True)
    auditor_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    utilization = models.CharField(max_length=50, choices=UTILIZATION_CHOICES)
    comments = models.TextField(null=True, blank=True)
    discrepancy = models.BooleanField(default=False)

    def __str__(self):
        return f"Asset ID: {self.audit_log_id.get_asset_id}"