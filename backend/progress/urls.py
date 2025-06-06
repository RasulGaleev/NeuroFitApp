from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProgressViewSet

router = DefaultRouter()
router.register('', ProgressViewSet, basename='progress')

urlpatterns = [
    path('', include(router.urls)),
]
