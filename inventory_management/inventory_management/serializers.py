# inventory_management/serializers.py
from rest_framework import serializers
from .models import UserRegistration
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegistration
        fields = ['user_id', 'name', 'position', 'location', 'password']

class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True) 
    password = serializers.CharField(required=True)

