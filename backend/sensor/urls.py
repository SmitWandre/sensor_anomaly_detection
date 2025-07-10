from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UploadJobViewSet

router = DefaultRouter()
router.register(r'uploads', UploadJobViewSet, basename='uploadjob')

urlpatterns = [
    path('', include(router.urls)),
]