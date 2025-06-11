from django.contrib import admin

from .models import ProgressChart


@admin.register(ProgressChart)
class ProgressChartAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'date', 'weight', 'height', 'notes', 'photo')
    list_filter = ('date',)
    search_fields = ('user__username', 'notes')
    ordering = ('-date',)

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
