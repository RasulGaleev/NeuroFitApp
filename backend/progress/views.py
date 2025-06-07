from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
        return ProgressChart.objects.filter(user=self.request.user).select_related('user')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        progress = self.get_queryset().first()
        if progress:
            return Response({
                "weight": progress.weight,
                "height": progress.height,
                "date": progress.date,
                "photo": progress.photo.url if progress.photo else None,
                "notes": progress.notes
            })
        return Response({"message": "Нет сохранённых данных о прогрессе."}, status=404)

    @action(detail=False, methods=['get'])
    def history(self, request):
        queryset = self.get_queryset().order_by('date')
        data = {}

        for progress in queryset:
            date_str = progress.date.strftime('%Y-%m-%d')
            if date_str not in data:
                data[date_str] = []

            data[date_str].append({
                "id": progress.id,
                "weight": progress.weight,
                "height": progress.height,
                "photo": progress.photo.url if progress.photo else None,
                "notes": progress.notes
            })

        return Response(data)
