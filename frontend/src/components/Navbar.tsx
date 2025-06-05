import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bot, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-gray-100 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-yellow-500"/>
            <span className="font-bold text-xl text-white">NeuroFit</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/coach"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <span>Тренер</span>
                </Link>
                <Link
                  to="/nutrition"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <span>Питание</span>
                </Link>
                <Link
                  to="/workouts"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <span>Тренировки</span>
                </Link>
                <Link
                  to="/progress"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <span>Прогресс</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <User className="h-5 w-5"/>
                  <span>Профиль</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-yellow-500 transition"
                >
                  <LogOut className="h-5 w-5"/>
                  <span>Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-yellow-500 transition"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-400 transition"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;