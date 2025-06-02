from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutViewSet

router = DefaultRouter()
router.register('', WorkoutViewSet, basename='workouts')

urlpatterns = [
    path('', include(router.urls)),
]
