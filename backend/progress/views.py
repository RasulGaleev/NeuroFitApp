from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ProgressChart
from .serializers import ProgressChartSerializer


class ProgressFilter(filters.FilterSet):
    date = filters.DateFilter(field_name='date')

    class Meta:
        model = ProgressChart
        fields = ['date']


class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressChartSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = ProgressFilter
    ordering_fields = ['date']
    ordering = ['-date']

    def get_queryset(self):
        return ProgressChart.objects.filter(user=self.request.user).select_related('user').order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
