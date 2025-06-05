import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  RefreshTokenType, TokenType, BioType, RegisterType,
  CoachGenerateType, Workout, Nutrition, Post, Comment, ProgressChart
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setAccessToken = (token: string) => localStorage.setItem('accessToken', token);
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const api = axios.create({ baseURL: API_BASE_URL });

// Attach access token to request headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Handle 401 errors and try to refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const { data } = await api.post<{ access: string }>('/token/refresh/', { refresh_token: refreshToken });
          setAccessToken(data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service ---

export const apiService = {
  // Auth
  login: (data: TokenType) => api.post('/token/', data),
  refreshToken: (data: RefreshTokenType) => api.post('/token/refresh/', data),
  logout: () => api.post('/logout/'),

  // User
  register: (data: RegisterType) => api.post('/users/register/', data),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data: BioType) => api.patch('/users/profile/', data),

  // Coach
  getGenerate: (data: CoachGenerateType) => api.post('/coaches/generate/', data),

  // Workout
  generateWorkout: () => api.post<Workout>('/workouts/generate/'),
  getLatestWorkout: () => api.get<Workout>('/workouts/latest/'),
  completeWorkout: (id: number) => axios.post(`/workouts/${id}/complete/`),


  // Nutrition
  generateNutritionPlan: () => api.post<Nutrition>('/nutrition/generate/'),
  getLatestNutritionPlan: () => api.get<Nutrition>('/nutrition/latest/'),

  // Posts
  getPosts: () => api.get<Post[]>('/posts/'),
  getPost: (id: number) => api.get<Post>(`/posts/${id}/`),
  createPost: (data: Partial<Post>) => api.post<Post>('/posts/', data),
  updatePost: (id: number, data: Partial<Post>) => api.patch<Post>(`/posts/${id}/`, data),
  deletePost: (id: number) => api.delete(`/posts/${id}/`),
  likePost: (id: number) => api.post(`/posts/${id}/like/`),

  // Comments
  getComments: (postId: number) => api.get<Comment[]>(`/posts/${postId}/comments/`),
  addComment: (postId: number, data: { content: string }) =>
    api.post<Comment>(`/posts/${postId}/comments/`, data),

  // Progress
  getProgress: () => api.get<ProgressChart[]>('/progress/'),
  getProgressEntry: (id: number) => api.get<ProgressChart>(`/progress/${id}/`),
  createProgress: (data: { weight: number; notes: string }) =>
    api.post<ProgressChart>('/progress/', data),
  updateProgress: (id: number, data: { weight: number; notes: string }) =>
    api.patch<ProgressChart>(`/progress/${id}/`, data),
  deleteProgress: (id: number) => api.delete(`/progress/${id}/`),
};
