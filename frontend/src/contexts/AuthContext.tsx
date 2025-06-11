import React, {createContext, useContext, useEffect, useState} from 'react';
import { apiService } from '../services/api';
import { UserType } from "../types/user.ts";
import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await apiService.getProfile();
        setUser(response.data);
        localStorage.setItem('userId', response.data.id.toString());
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
  };

    const updateAuth = async (username: string, password: string) => {
    try {
      const response = await apiService.login({ username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      const userResponse = await apiService.getProfile();
      setUser(userResponse.data);
      localStorage.setItem('userId', userResponse.data.id.toString());
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      await updateAuth(username, password);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, password2: string) => {
    try {
      await apiService.register({ username, email, password, password2 });
      await updateAuth(username, password);
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен быть использован внутри AuthProvider');
  }
  return context;
};
