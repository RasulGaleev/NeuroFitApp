from django.contrib import admin

from .models import Workout


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'date', 'title', 'plan', 'completed')
    list_filter = ('date', 'completed')
    search_fields = ('user__username', 'title')
    ordering = ('-date',)

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
