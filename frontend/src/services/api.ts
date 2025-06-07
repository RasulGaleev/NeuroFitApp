import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ProfileType, RegisterType } from '../types/user.ts';
import { CoachGenerateType } from '../types/coach';
import { RefreshTokenType, TokenType } from '../types/token.ts';
import { WorkoutType } from '../types/workouts';
import { NutritionType } from '../types/nutrition';
import { ProgressChartType } from '../types/progress';
import { CommentType, PostType } from "../types/blog.ts";


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
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${data.access}`,
          };

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
  getPosts: () => api.get<PostType[]>('/posts/'),
  getPost: (id: number) => api.get<PostType>(`/posts/${id}/`),
  createPost: (data: Partial<PostType>) => api.post<PostType>('/posts/', data),
  updatePost: (id: number, data: Partial<PostType>) => api.patch<PostType>(`/posts/${id}/`, data),
  deletePost: (id: number) => api.delete(`/posts/${id}/`),
  likePost: (id: number) => api.post(`/posts/${id}/like/`),

  // Comments
  getComments: (postId: number) => api.get<CommentType[]>(`/posts/${postId}/comments/`),
  addComment: (postId: number, data: { content: string }) => pi.post<CommentType>(`/posts/${postId}/comments/`, data),

  // Progress
  getProgress: () => api.get<ProgressChartType[]>('/progress/'),
  getProgressEntry: (id: number) => api.get<ProgressChartType>(`/progress/${id}/`),
  createProgress: (data: { weight: number; notes: string }) => api.post<ProgressChartType>('/progress/', data),
  updateProgress: (id: number, data: { weight: number; notes: string }) => api.patch<ProgressChartType>(`/progress/${id}/`, data),
  deleteProgress: (id: number) => api.delete(`/progress/${id}/`),
};
