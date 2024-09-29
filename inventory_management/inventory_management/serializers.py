from rest_framework import serializers
from .models import Stations,UserRegistration

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegistration
        fields = ['user_id', 'name', 'position', 'location', 'password']

class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class StationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stations
        fields = ['station_id', 'station_name', 'station_location']
