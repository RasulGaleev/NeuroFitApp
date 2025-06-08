from rest_framework import serializers

from .models import ProgressChart


class ProgressChartSerializer(serializers.ModelSerializer):
    bmi = serializers.SerializerMethodField()

    class Meta:
        model = ProgressChart
        fields = ['id', 'user', 'date', 'weight', 'height', 'photo', 'notes', 'created_at', 'bmi']
        read_only_fields = ['user', 'created_at', ]

    def get_bmi(self, obj):
        return obj.calculate_bmi()
