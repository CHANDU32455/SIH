from rest_framework import serializers
from .models import Asset, AuditLog, Stations,UserRegistration

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
class AuditLogSerializer(serializers.ModelSerializer):
    asset_id = serializers.CharField(source='audit_log_id.asset_id')  # Map asset_id from audit_log_id

    class Meta:
        model = AuditLog
        fields = ['audit_date', 'auditor_name', 'location', 'status', 'utilization', 'comments', 'discrepancy', 'asset_id']

    def create(self, validated_data):
        # Extract the asset_id from validated_data
        asset_id = validated_data.pop('audit_log_id')['asset_id']
        asset = Asset.objects.get(asset_id=asset_id)

        # Create the AuditLog entry
        audit_log = AuditLog.objects.create(audit_log_id=asset, **validated_data)
        return audit_log

    def update(self, instance, validated_data):
        # Only update the fields that are not read-only
        instance.status = validated_data.get('status', instance.status)
        instance.location = validated_data.get('location', instance.location)
        instance.utilization = validated_data.get('utilization', instance.utilization)
        instance.comments = validated_data.get('comments', instance.comments)
        instance.discrepancy = validated_data.get('discrepancy', instance.discrepancy)
        instance.save()
        return instance
