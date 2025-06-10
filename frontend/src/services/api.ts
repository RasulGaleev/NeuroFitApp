import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ProfileType, RegisterType } from '../types/user.ts';
import { CoachGenerateType } from '../types/coach';
import { RefreshTokenType, TokenType } from '../types/token.ts';
import { WorkoutType } from '../types/workouts';
import { NutritionType } from '../types/nutrition';
import { ProgressChartType } from '../types/progress';
import { CommentType, PostType, PaginatedResponse } from "../types/blog.ts";


const API_BASE_URL = 'http://localhost:8000/api';

const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setAccessToken = (token: string) => localStorage.setItem('accessToken', token);
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken
          });

          setAccessToken(data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Auth
  login: (data: TokenType) => api.post('/token/', data),
  refreshToken: (data: RefreshTokenType) => api.post('/token/refresh/', data),
  logout: () => api.post('/logout/'),

  // User
  register: (data: RegisterType) => api.post('/users/register/', data),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data: ProfileType) => api.patch('/users/profile/', data),

  // Coach
  getGenerate: (data: CoachGenerateType) => api.post('/coaches/generate/', data),

  // Workout
  generateWorkout: () => api.post<WorkoutType>('/workouts/generate/'),
  getLatestWorkout: () => api.get<WorkoutType>('/workouts/latest/'),
  completeWorkout: (id: number) => api.post(`/workouts/${id}/complete/`),


  // Nutrition
  generateNutritionPlan: () => api.post<NutritionType>('/nutrition/generate/'),
  getLatestNutritionPlan: () => api.get<NutritionType>('/nutrition/latest/'),

  // Posts
  getPosts: () => api.get<PaginatedResponse<PostType>>('/blog/posts/'),
  getPost: (id: number) => api.get<PostType>(`/blog/posts/${id}/`),
  createPost: (data: FormData) => api.post<PostType>('/blog/posts/', data),
  updatePost: (id: number, data: Partial<PostType>) => api.patch<PostType>(`/blog/posts/${id}/`, data),
  deletePost: (id: number) => api.delete(`/blog/posts/${id}/`),

  // Likes
  likePost: (id: number) => api.post(`/blog/posts/${id}/likes/`),

  // Comments
  getComments: (postId: number) => api.get<PaginatedResponse<CommentType>>(`/blog/posts/${postId}/comments/`),
  addComment: (postId: number, data: { content: string }) => api.post<CommentType>(`/blog/posts/${postId}/comments/`, data),

  // Progress
  getProgress: () => api.get<ProgressChartType[]>('/progress/'),
  getProgressAll: () => api.get<ProgressChartType[]>('/progress/all/'),
  getLatestProgress: () => api.get<ProgressChartType>('/progress/latest/'),
  createProgress: (data: FormData) => api.post<ProgressChartType>('/progress/', data),
  deleteProgress: (id: number) => api.delete(`/progress/${id}/`),
};
