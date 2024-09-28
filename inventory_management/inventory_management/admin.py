# inventory_management/admin.py
from django.contrib import admin
from .models import UserRegistration, Stations

admin.site.register(UserRegistration)

admin.site.register(Stations)