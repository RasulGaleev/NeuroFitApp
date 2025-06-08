from rest_framework import serializers
from .models import Workout


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['id', 'date', 'title', 'plan', 'completed', 'created_at']
        read_only_fields = ['user', 'created_at']
