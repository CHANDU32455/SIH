"""
URL configuration for inventory_management project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from .views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', TemplateView.as_view(template_name='index.html')),
    path('api/register/', UserRegistrationView.as_view(), name='user-registration'),
    path('api/login/', UserLoginView.as_view(), name='user-login'),
    path('api/stations/', StationListCreateView.as_view(), name='stations-list-create'),
    path('api/assets/', create_asset, name='asset-list-create'),
    path('api/bulk_assets/', BulkAssetCreateView.as_view(), name='bulk_asset_create'),
    path('api/station-masters/', StationMastersListView.as_view(), name='station-masters-list'),
    path('create-asset/', create_asset, name='create-asset'),
    path('api/assets/station/<str:station_name>/', AssetListByStationView.as_view(), name='assets-by-station'),
]