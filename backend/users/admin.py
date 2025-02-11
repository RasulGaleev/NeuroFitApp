from django.contrib import admin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_admin', 'created_at', 'updated_at')
    list_filter = ('is_admin', 'gender')
    search_fields = ('username', 'email')
