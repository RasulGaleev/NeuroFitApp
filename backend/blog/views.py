from django_filters import rest_framework as filters
from rest_framework import viewsets, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Post, Comment, Like
from .serializers import PostSerializer, CommentSerializer, LikeSerializer


class PostFilter(filters.FilterSet):
    created_at = filters.DateFilter(field_name='created_at')

    class Meta:
        model = Post
        fields = ['created_at']


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = PostFilter
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Post.objects.select_related('user').prefetch_related('comments', 'likes')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        post = self.get_object()
        if post.user != request.user:
            raise PermissionDenied("Вы не можете удалить чужой пост")
        return super().destroy(request, *args, **kwargs)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Comment.objects.filter(post_id=self.kwargs['post_pk']).select_related('user')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_pk')
        content = request.data.get('content', '').strip()

        if not content:
            return Response({"detail": "Комментарий не может быть пустым."}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment.objects.create(
            content=content,
            user=request.user,
            post_id=post_id
        )

        serializer = self.get_serializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        if comment.user != request.user:
            raise PermissionDenied("Вы не можете удалить чужой комментарий")
        return super().destroy(request, *args, **kwargs)


class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(post_id=self.kwargs['post_pk']).select_related('user')

    def create(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_pk')
        post = Post.objects.get(id=post_id)

        like, created = Like.objects.get_or_create(
            post=post,
            user=request.user,
            defaults={'user': request.user}
        )

        if not created:
            like.delete()
            return Response({
                "status": "unliked",
                "likes_count": post.likes.count(),
                "is_liked": False
            }, status=status.HTTP_200_OK)

        return Response({
            "status": "liked",
            "likes_count": post.likes.count(),
            "is_liked": True
        }, status=status.HTTP_201_CREATED)
