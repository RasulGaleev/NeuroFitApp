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
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_bmi(self):
        if self.weight and self.height:
            height_in_meters = self.height / 100
            return round(round(self.weight) / (height_in_meters ** 2), 2)
        return None

    class Meta:
        verbose_name = 'Прогресс'
        verbose_name_plural = 'Прогресс'
