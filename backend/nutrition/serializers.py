from rest_framework import serializers
from .models import Nutrition


class NutritionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nutrition
        fields = ['id', 'date', 'meals', 'calories', 'created_at']
        read_only_fields = ['user', 'created_at']
