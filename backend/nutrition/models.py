from django.db import models
from django.utils.timezone import now
from users.models import CustomUser


class Nutrition(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(default=now)
    meals = models.JSONField()
    calories = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Питание'
        verbose_name_plural = 'Питание'
