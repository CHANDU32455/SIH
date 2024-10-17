# inventory_management/admin.py
from django.contrib import admin
from .models import UserRegistration, Stations, Asset, AuditLog,AssetRequest

admin.site.register(UserRegistration)

admin.site.register(Stations)

admin.site.register(Asset)

admin.site.register(AuditLog)

admin.site.register(AssetRequest)