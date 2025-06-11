import React, { useLayoutEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bot, User, LogOut, Menu, X, Dumbbell, Apple, LineChart, BookOpen, MessageSquare } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useLayoutEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/blog');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/login');
    }
  };

  const navItems = [
    { to: '/coach', label: 'Тренер', icon: <MessageSquare className="w-5 h-5 text-yellow-500" /> },
    { to: '/workouts', label: 'Тренировки', icon: <Dumbbell className="w-5 h-5 text-yellow-500" /> },
    { to: '/nutrition', label: 'Питание', icon: <Apple className="w-5 h-5 text-yellow-500" /> },
    { to: '/progress', label: 'Прогресс', icon: <LineChart className="w-5 h-5 text-yellow-500" /> },
    { to: '/profile', label: 'Профиль', icon: <User className="w-5 h-5 text-yellow-500" /> },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bot className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-white">NeuroFit</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-gray-300 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5 text-yellow-500" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-yellow-500 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                    <User className="w-5 h-5 text-yellow-500" />
                    Войти
                  </Link>
                  <Link to="/register" className="bg-yellow-500 text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-400 flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-900" />
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-500 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-gray-300 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-yellow-500 block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5 text-yellow-500" />
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-yellow-500 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-yellow-500" />
                  Войти
                </Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 text-gray-900 block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-400 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5 text-gray-900" />
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;