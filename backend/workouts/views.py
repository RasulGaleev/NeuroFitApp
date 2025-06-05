import json

from coaches.services import generate_answer
from coaches.utils import get_system_message, workout_instruction
from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Workout
from .serializers import WorkoutSerializer


class WorkoutFilter(filters.FilterSet):
    date = filters.DateFilter(field_name='date')
    completed = filters.BooleanFilter(field_name='completed')

    class Meta:
        model = Workout
        fields = ['date', 'completed']


class WorkoutViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = WorkoutFilter
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        return Workout.objects.filter(user=self.request.user).select_related('user')

    @action(detail=False, methods=['get'])
    def latest(self, request):
        workout = self.get_queryset().first()
        if workout:
            return Response({
                "id": workout.id,
                "date": workout.date,
                "plan": workout.plan,
                "completed": workout.completed
            })
        return Response({"message": "Нет сохранённых тренировок."}, status=404)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        system_msg = get_system_message(request.user)
        messages = [system_msg, workout_instruction]

        try:
            result = generate_answer(messages=messages, temperature=0.1)
            data = json.loads(result)
            workout = Workout.objects.create(user=request.user, plan=data)
            return Response({
                "id": workout.id,
                "date": workout.date,
                "plan": workout.plan,
                "completed": workout.completed
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        workout = self.get_object()
        workout.completed = True
        workout.save()
        return Response({'status': 'workout completed'}, status=status.HTTP_200_OK)
