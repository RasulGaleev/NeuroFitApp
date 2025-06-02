from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import NutritionViewSet

router = DefaultRouter()
router.register('', NutritionViewSet, basename='nutrition')

urlpatterns = [
    path('', include(router.urls)),
]
