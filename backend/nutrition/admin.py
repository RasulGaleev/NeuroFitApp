from django.contrib import admin

from .models import Nutrition


@admin.register(Nutrition)
class NutritionAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'calories')
    list_filter = ('date',)
    search_fields = ('user__username',)
    ordering = ('-date',)
