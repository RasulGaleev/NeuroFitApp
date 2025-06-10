import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { PostType, CommentType } from '../types/blog';
import { Heart, MessageCircle, Plus, Upload, ChevronDown, ChevronUp, Send } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [comments, setComments] = useState<Record<number, CommentType[]>>({});
  const [newComment, setNewComment] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null as File | null });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.getPosts();
      if (response?.data?.results) {
        const postsWithDefaults = response.data.results.map(post => ({
          ...post,
          user: {
            id: post.user?.id || 0,
            username: post.user?.username || 'User',
            avatar: post.user?.avatar || null
          },
          comments: post.comments || [],
          likes_count: post.likes_count || 0,
          is_liked: post.is_liked || false
        }));
        setPosts(postsWithDefaults);
      }
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('content', newPost.content);
    if (newPost.image) {
      formData.append('image', newPost.image);
    }

    try {
      await apiService.createPost(formData);
      setShowCreateForm(false);
      setNewPost({ title: '', content: '', image: null });
      setNotification('Ваш пост отправлен на проверку');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Ошибка при создании поста:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await apiService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              likes_count: response.data.status === 'liked' ? post.likes_count + 1 : post.likes_count - 1,
              is_liked: response.data.status === 'liked'
            }
          : post
      ));
    } catch (error) {
      console.error('Ошибка при лайке поста:', error);
    }
  };

  const handleToggleComments = async (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      try {
        const response = await apiService.getComments(postId);
        console.log('Comments response:', response.data);
        setComments(prev => ({
          ...prev,
          [postId]: response.data.results || []
        }));
      } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error);
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent, postId: number) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await apiService.addComment(postId, { content: newComment });
      const newCommentData = response.data;
      
      setComments(prev => ({
        ...prev,
        [postId]: [newCommentData, ...(prev[postId] || [])]
      }));

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? {
              ...post,
              comments: [newCommentData, ...(post.comments || [])]
            }
          : post
      ));

      setNewComment('');
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-gray-100 text-center">Нет доступных постов</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {notification && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
            {notification}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Блог</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Создать пост
          </button>
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Создать пост</h2>
              <form onSubmit={handleCreatePost}>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Заголовок"
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 mb-4"
                  required
                />
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Содержание"
                  className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 mb-4 h-32"
                  required
                />
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Фото</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewPost({ ...newPost, image: e.target.files?.[0] || null })}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex-1 p-3 bg-gray-700 text-gray-100 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-600 transition"
                    >
                      {newPost.image ? newPost.image.name : 'Выберите фото'}
                    </label>
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="bg-gray-700 text-gray-100 p-3 rounded-md hover:bg-gray-600 transition"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-400 hover:text-gray-300"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-600"
                  >
                    Создать
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden"
            >
              {post.image && (
                <div className="relative w-full h-80 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-contain bg-gray-900"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  {post.user.avatar ? (
                    <img 
                      src={`http://localhost:8000${post.user.avatar}`} 
                      alt={post.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-gray-300">
                      {post.user.username[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-gray-100 font-medium">{post.user.username}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4">{post.content}</p>

                <div className="flex items-center gap-6 border-t border-gray-700 pt-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${post.is_liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} transition`}
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.likes_count}</span>
                  </button>
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments?.length || 0}</span>
                    {expandedPost === post.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {expandedPost === post.id && (
                  <div className="mt-4 border-t border-gray-700 pt-4">
                    <div className="space-y-3">
                      {comments[post.id] && comments[post.id].length > 0 ? (
                        comments[post.id].map((comment) => (
                          <div
                            key={`${post.id}-${comment.id}`}
                            className="bg-gray-700 rounded-md p-3"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {comment.user.avatar ? (
                                <img 
                                  src={`http://localhost:8000${comment.user.avatar}`} 
                                  alt={comment.user.username}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-xs">
                                  {comment.user.username[0].toUpperCase()}
                                </div>
                              )}
                              <div className="text-sm text-gray-400">
                                {comment.user.username}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-gray-100">{comment.content}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-2">
                          Нет комментариев
                        </div>
                      )}
                    </div>

                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="mt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Добавить комментарий..."
                          className="flex-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="bg-yellow-500 text-gray-900 p-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;