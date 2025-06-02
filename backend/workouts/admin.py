from django.contrib import admin

from .models import Workout


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'completed')
    list_filter = ('date', 'completed')
    search_fields = ('user__username',)
    ordering = ('-date',)
