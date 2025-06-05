import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Trash2, Edit2 } from 'lucide-react';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiService.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке постов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      await apiService.likePost(id);
      setPosts(posts.map(post => 
        post.id === id 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Ошибка при лайке поста:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении поста:', error);
    }
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    try {
      const response = await apiService.getComments(post.id);
      setComments(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;

    try {
      const response = await apiService.addComment(selectedPost.id, { content: newComment });
      setComments([...comments, response.data]);
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

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Блог</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 cursor-pointer hover:border-yellow-500 transition"
                onClick={() => handlePostClick(post)}
              >
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-300 mb-4 line-clamp-2">{post.content}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition"
                    >
                      <Heart className="w-5 h-5" />
                      <span>{post.likes_count}</span>
                    </button>
                    <div className="flex items-center gap-1 text-gray-400">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id);
                    }}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedPost && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                {selectedPost.title}
              </h2>
              <p className="text-gray-300 mb-6">{selectedPost.content}</p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-100">Комментарии</h3>
                <form onSubmit={handleAddComment} className="mb-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Добавить комментарий..."
                    className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </form>

                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-700 rounded-md p-3"
                    >
                      <div className="text-sm text-gray-400 mb-1">
                        {comment.author.username}
                      </div>
                      <div className="text-gray-100">{comment.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog; 