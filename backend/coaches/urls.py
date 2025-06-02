from django.urls import path

from .views import CoachesGenerateView

urlpatterns = [
    path("generate/", CoachesGenerateView.as_view(), name="coaches-generate"),
]
