import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Bot } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiService } from "../services/api";

type TrainingGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'general_fitness';

const Register = () => {
  const [showBiometrics, setShowBiometrics] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [date_of_birth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState<TrainingGoal>('general_fitness');
  const [has_equipment, setHasEquipment] = useState(false);

  const handleInitialRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      await register(username, email, password);
      setShowBiometrics(true);
      toast.success('Регистрация успешна! Теперь давайте настроим ваш профиль.');
    } catch (error: any) {
      setError(error.response?.data?.password || 'Ошибка при регистрации');
    }
  };

  const handleBiometricsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateProfile({
        date_of_birth,
        gender,
        weight: parseFloat(weight),
        height: parseInt(height),
        goal,
        has_equipment
      });
      toast.success('Профиль успешно обновлен!');
      navigate('/profile');
      window.location.reload();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  };

  if (showBiometrics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <Bot className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white">Настройка профиля</h2>
            <p className="text-gray-400 mt-2">Давайте настроим ваш профиль для персонализированных рекомендаций</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleBiometricsSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Пол
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                >
                  <option value="male">Мужской</option>
                  <option value="female">Женский</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Дата рождения
                </label>
                <input
                  type="date"
                  min="1925-01-01"
                  required
                  value={date_of_birth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Вес (кг)
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="20"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Рост (см)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Цель тренировок
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as TrainingGoal)}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="weight_loss">Снижение веса</option>
                <option value="muscle_gain">Набор мышечной массы</option>
                <option value="endurance">Выносливость</option>
                <option value="general_fitness">Общая физическая подготовка</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_equipment"
                checked={has_equipment}
                onChange={(e) => setHasEquipment(e.target.checked)}
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="has_equipment" className="ml-2 block text-sm text-gray-300">
                У меня есть спортивное оборудование
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900"
            >
              Завершить настройку
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <UserPlus className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">Регистрация</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-md border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleInitialRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Логин
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Пароль
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Подтвердите пароль
            </label>
            <input
              type="password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-gray-900"
          >
            Зарегистрироваться
            <UserPlus className="ml-2 h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;