from django.contrib import admin

from .models import ProgressChart


@admin.register(ProgressChart)
class ProgressChartAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'weight', 'height')
    list_filter = ('date',)
    search_fields = ('user__username', 'notes')
    ordering = ('-date',)
