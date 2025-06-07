from django.db import models
from django.utils.timezone import now
from users.models import CustomUser


class ProgressChart(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField(default=now)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    height = models.PositiveIntegerField(null=True, blank=True)
    photo = models.ImageField(upload_to='progress_images/', null=True, blank=True)
    notes = models.TextField()
