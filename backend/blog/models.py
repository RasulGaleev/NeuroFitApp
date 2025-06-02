from django.db import models
from django.utils.timezone import now
from nutrition.models import Nutrition
from users.models import CustomUser
from workouts.models import Workout


class Post(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    workout = models.ForeignKey(Workout, null=True, blank=True, on_delete=models.SET_NULL)
    meal_plan = models.ForeignKey(Nutrition, null=True, blank=True, on_delete=models.SET_NULL)
    image = models.ImageField(upload_to='blog_images/', null=True, blank=True)
    created_at = models.DateTimeField(default=now)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
