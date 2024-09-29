# inventory_management/views.py
from django.shortcuts import render
from rest_framework import generics,status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password
from django.db.models import Q
from .models import UserRegistration
from .serializers import UserRegistrationSerializer,UserLoginSerializer,StationsSerializer
from .serializers import AssetSerializer
from .models import Stations

def index(request):
    return render(request, 'frontend/build/index.html')

class UserRegistrationView(generics.CreateAPIView):
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

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            password = serializer.validated_data['password']

            # Find user by identifier (either username or user_id)
            try:
                user = UserRegistration.objects.get(Q(user_id=identifier) | Q(name=identifier))
            except UserRegistration.DoesNotExist:
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

             # Check if the provided password matches the stored hashed password
            if check_password(password, user.password):
                # Return only the relevant fields
                return Response({
                    "message": "Login successful!",
                    "user": {
                        "name": user.name,
                        "location": user.location,
                        "position": user.position
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

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
def create_asset(request):
    serializer = AssetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)
