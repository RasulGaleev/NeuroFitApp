import React, {createContext, useContext, useEffect, useState} from 'react';
import { apiService } from '../services/api';
import { User } from "../types/user";


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Функция для проверки аутентификации
  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await apiService.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const updateUserData = async (username: string, password: string) => {
    try {
      const response = await apiService.getToken({ username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      const userResponse = await apiService.getProfile();
      setUser(userResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await updateUserData(username, password);
    } catch (error) {
      console.error('Ошибка при логине:', error);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await apiService.register({ username, email, password });
      await updateUserData(username, password);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
