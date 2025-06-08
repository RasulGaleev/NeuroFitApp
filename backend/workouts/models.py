from django.db import models
from django.utils.timezone import now
from users.models import CustomUser


class Workout(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(default=now)
    title = models.CharField(max_length=255)
    plan = models.JSONField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
