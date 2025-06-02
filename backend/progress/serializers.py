from rest_framework import serializers

from .models import ProgressChart


class ProgressChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressChart
        fields = ['id', 'user', 'date', 'weight', 'height', 'photo', 'notes']
