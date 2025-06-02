from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProgressChartViewSet

router = DefaultRouter()
router.register('', ProgressChartViewSet, basename='progress-chart')

urlpatterns = [
    path('', include(router.urls)),
]
