# inventory_management/views.py
from datetime import timezone
from django.shortcuts import get_object_or_404, render
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from .models import Asset, AuditLog, UserRegistration,Stations
from .serializers import AuditLogSerializer, UserRegistrationSerializer,UserLoginSerializer,StationsSerializer,AssetSerializer
from rest_framework.exceptions import NotFound


def index(request):
    return render(request, 'frontend/build/index.html')

class UserRegistrationView(generics.GenericAPIView):
    queryset = UserRegistration.objects.all()
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        
        # If validation passes, save the new user registration
        self.perform_create(serializer)
        
        # Return a success response with the created user's data
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            try:
                user = UserRegistration.objects.get(user_id=user_id)
                serializer = self.get_serializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserRegistration.DoesNotExist:
                return Response({"detail": "No user found for the given user ID."}, status=status.HTTP_404_NOT_FOUND)
        
        # If no user_id is provided, return an error message
        return Response({"detail": "Please provide a user_id to fetch user data."}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        user_id = self.request.query_params.get('user_id', None)
        if user_id is None:
            return Response({"detail": "Please provide a user_id to update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserRegistration.objects.get(user_id=user_id)
        except UserRegistration.DoesNotExist:
            return Response({"detail": "No user found for the given user ID."}, status=status.HTTP_404_NOT_FOUND)

        # Set partial=True to allow partial updates
        serializer = self.get_serializer(user, data=request.data, partial=True)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        # Save the updated user data
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_queryset(self):
        return UserRegistration.objects.all()

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']

            # Find user by identifier (either user_id or name)
            try:
                user = UserRegistration.objects.get(Q(user_id=identifier) | Q(name=identifier))
            except UserRegistration.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the provided password matches the stored hashed password
            if check_password(password, user.password):
                # Check if the user is associated with a station
                station = None
                if user.station:
                    station = {
                        "station_id": user.station.station_id,
                        "station_name": user.station.station_name,
                        "station_location": user.station.station_location
                    }

                # Return the user information including station details (if available)
                return Response({
                    "message": "Login successful!",
                    "user": {
                        "name": user.name,
                        "user_id": user.user_id,
                        "location": user.location,
                        "position": user.position,
                        "station": station
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StationListCreateView(generics.ListCreateAPIView):
    queryset = Stations.objects.all()
    serializer_class = StationsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            # Validate the data, raise validation errors if the data is invalid
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save the new station if validation passes
        self.perform_create(serializer)
        
        # Return the created station's data as a success response
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get_queryset(self):
        queryset = Stations.objects.all()
        station_name = self.request.query_params.get('station_name', None)
        if station_name is not None:
            queryset = queryset.filter(station_name=station_name)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StationMastersListView(generics.ListAPIView):
    queryset = UserRegistration.objects.all()
    serializer_class = UserRegistrationSerializer

@api_view(['POST'])
def create_asset(request):
    serializer = AssetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
@api_view(['GET'])
def get_assets(request):
    assets = Asset.objects.all().values('asset_id','name','location','status')
    return Response(assets)  # No need for serialization if using .values()


from rest_framework.views import APIView
class BulkAssetCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        
        # Check if the request is a list of assets
        if isinstance(data, list):
            serializer = AssetSerializer(data=data, many=True)
        else:
            return Response({'error': 'Expected a list of assets'}, status=status.HTTP_400_BAD_REQUEST)
        
        if serializer.is_valid():
            serializer.save()  # Save all assets at once
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssetListByStationView(generics.ListAPIView):
    serializer_class = AssetSerializer

    def get_queryset(self):
        station_name = self.kwargs['station_name']
        sort = self.request.query_params.get('sort', 'asset_type')  # Default sort by asset_type

        try:
            # Find the station by station_name
            station = Stations.objects.get(station_name=station_name)
            
            # Build the queryset for assets based on the station
            queryset = Asset.objects.filter(station_id=station)
            
            # Apply sorting based on the 'sort' parameter
            if sort == 'asset_type':
                queryset = queryset.order_by('asset_type')
            elif sort == 'status':
                queryset = queryset.order_by('status')
            elif sort == 'ascending':
                queryset = queryset.order_by('name')
            elif sort == 'descending':
                queryset = queryset.order_by('-name')
            
            return queryset
        
        except Stations.DoesNotExist:
            raise NotFound(detail="Station not found", code=404)

class AuditLogView(generics.ListAPIView):
    queryset = AuditLog.objects.all()  # Retrieve all audit logs
    serializer_class = AuditLogSerializer

    def get(self, request, *args, **kwargs):
        # Fetch all audit logs
        audit_logs = self.get_queryset()

        if audit_logs.exists():
            serializer = self.get_serializer(audit_logs, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"message": "No logs found to fetch."}, status=status.HTTP_404_NOT_FOUND)
class AuditLogCreateView(generics.CreateAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
class AuditLogDeleteView(generics.DestroyAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    lookup_field = 'audit_log_id'  # Use 'audit_log_id' instead of 'pk'

    def get_queryset(self):
        # Get the audit log based on the asset_id string (audit_log_id from URL)
        audit_log_id = self.kwargs['audit_log_id']
        # Assuming audit_log_id is the string value from the Asset model's asset_id field
        return AuditLog.objects.filter(audit_log_id__asset_id=audit_log_id)
    
    def delete(self, request, *args, **kwargs):
        audit_log = self.get_object()
        if audit_log:
            audit_log.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
class AuditLogUpdateView(generics.UpdateAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    lookup_field = 'audit_log_id'  # This should match your URL configuration

    def get_queryset(self):
        audit_log_id = self.kwargs['audit_log_id']
        return AuditLog.objects.filter(audit_log_id__asset_id=audit_log_id)
