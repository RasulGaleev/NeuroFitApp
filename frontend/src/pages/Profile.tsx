import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Edit } from 'lucide-react';
import { apiService } from '../services/api';
import { BioType } from '../types/user';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
  date_of_birth: '',
  gender: '',
  height: 0,
  weight: 0,
  goal: '',
} as BioType);

  useEffect(() => {
    if (user) {
      setFormData({
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
        height: user.height || 0,
        weight: user.weight || 0,
        goal: user.goal || '',
      } as BioType);
    }
  }, [user]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await apiService.updateProfile(formData);
    setUser(response.data);
    setIsEditing(false);
  } catch (error) {
    console.error('Ошибка при обновлении данных профиля', error);
  }
};

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-yellow-500 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100">{user.username}</h1>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 text-gray-300 hover:text-yellow-500"
          >
            <Edit className="h-5 w-5" />
            <span>{isEditing ? 'Отменить' : 'Редактировать'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Дата рождения
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                min="1925-01-01"
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Пол
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Рост (см)
              </label>
              <input
                type="number"
                min="50"
                max="250"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: parseInt(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Вес (кг)
              </label>
              <input
                type="number"
                min="20"
                max="200"
                step="0.1"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({...formData, weight: parseFloat(e.target.value)})
                }
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Цель
              </label>
              <select
                value={formData.goal}
                onChange={(e) =>
                  setFormData({...formData, goal: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              >
                <option value="">Выберите цель</option>
                <option value="weight_loss">Похудение</option>
                <option value="muscle_gain">Набор мышечной массы</option>
                <option value="endurance">Увеличение выносливости</option>
                <option value="general_fitness">Общая физическая форма</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Сохранить изменения
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300">Дата рождения</h3>
              <p className="mt-1 text-lg text-gray-100">
                {user.date_of_birth || 'Не указано'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Пол</h3>
              <p className="mt-1 text-lg text-gray-100">
                {user.gender === 'male' ? 'Мужской' : 'Женский' || 'Не указано'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Рост (см)</h3>
              <p className="mt-1 text-lg text-gray-100">
                {user.height || 'Не указано'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Вес (кг)</h3>
              <p className="mt-1 text-lg text-gray-100">
                {user.weight || 'Не указано'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300">Цель</h3>
              <p className="mt-1 text-lg text-gray-100">
                {user.goal === 'weight_loss'
                  ? 'Похудение'
                  : user.goal === 'muscle_gain'
                    ? 'Набор мышечной массы'
                    : user.goal === 'endurance'
                      ? 'Увеличение выносливости'
                      : user.goal === 'general_fitness'
                        ? 'Общая физическая форма'
                        : 'Не указано'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
