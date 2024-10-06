from rest_framework import serializers
from .models import Asset, Stations,UserRegistration

class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegistration
        fields = ['user_id', 'name', 'position', 'location', 'station', 'password']  # Include 'password' for registration
        read_only_fields = ['user_id']  # Make user_id read-only during updates

    def create(self, validated_data):
        # Handle user registration (password is required)
        password = validated_data.pop('password')
        user = UserRegistration(**validated_data)
        user.set_password(password)  # Hash the password
        user.save()
        return user

    def update(self, instance, validated_data):
        # Handle user updates (password is optional)
        # Prevent password update if not provided
        validated_data.pop('password', None)

        # Update the other fields as usual
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class StationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stations
        fields = '__all__'
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = '__all__'