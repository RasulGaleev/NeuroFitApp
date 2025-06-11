from django.contrib import admin

from .models import Nutrition


@admin.register(Nutrition)
class NutritionAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'date', 'meals', 'calories')
    list_filter = ('date',)
    search_fields = ('user__username',)
    ordering = ('-date',)

    def get_username(self, obj):
        return obj.user.username
    get_username.short_description = 'Username'
