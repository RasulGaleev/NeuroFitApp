import json

from coaches.services import generate_answer
from coaches.utils import get_system_message
from django.utils.timezone import now, localtime
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
        today = localtime(now()).date()
        workout = self.get_queryset().filter(date=today).order_by('-created_at').first()
        if workout:
            return Response({
                "id": workout.id,
                "title": workout.title,
                "date": workout.date,
                "plan": workout.plan,
                "completed": workout.completed
            })
        return Response({"message": "Нет тренировки на сегодня."}, status=404)

    @action(detail=False, methods=['post'])
    def generate(self, request):
        try:
            result = generate_answer(messages=[get_system_message(request.user, "workout")], temperature=0.2)
            data = json.loads(result)
            workout = Workout.objects.create(
                user=request.user,
                title=data['title'],
                plan=data['exercises']
            )
            return Response({
                "id": workout.id,
                "title": workout.title,
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
        return Response({'status': 'Workout completed'}, status=status.HTTP_200_OK)
