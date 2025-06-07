import json

from coaches.services import generate_answer
from coaches.utils import get_system_message, nutrition_instruction
from django.utils.timezone import now
from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Nutrition
from .serializers import NutritionSerializer


class NutritionFilter(filters.FilterSet):
    date = filters.DateFilter(field_name='date')

    class Meta:
        model = Nutrition
        fields = ['date']


class NutritionViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = NutritionFilter
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        return Nutrition.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        today = now().date()
        nutrition = self.get_queryset().filter(date=today).order_by('-created_at').first()
        if nutrition:
            return Response({
                "id": nutrition.id,
                "meals": nutrition.meals,
                "calories": nutrition.calories,
                "date": nutrition.date
            })
        return Response({"message": "Нет плана питания на сегодня."}, status=404)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        system_msg = get_system_message(request.user)
        messages = [system_msg, nutrition_instruction]

        try:
            result = generate_answer(messages=messages, temperature=0.1)
            data = json.loads(result)
            nutrition = Nutrition.objects.create(
                user=request.user,
                meals=data.get("meals"),
                calories=data.get("calories")
            )
            return Response({
                "id": nutrition.id,
                "date": nutrition.date,
                "meals": nutrition.meals,
                "calories": nutrition.calories
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
