from django.contrib import admin

from .models import Post, Comment, Like


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'title', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('user__username', 'content', 'title')
    ordering = ('-created_at',)

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'post', 'content', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'content')
    ordering = ('-created_at',)

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_username', 'post', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username',)
    ordering = ('-created_at',)

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Username'
